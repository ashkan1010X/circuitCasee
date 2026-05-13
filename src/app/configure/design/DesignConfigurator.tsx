"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import NextImage from "next/image";
import { cn, formatPrice } from "@/lib/utils";
import { Rnd } from "react-rnd";
import HandleComponent from "@/components/HandleComponent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, Radio } from "@headlessui/react";
import { useRef, useState } from "react";
import { COLORS, FINISHES, MATERIALS } from "@/validators/option-validator";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MODELS } from "@/validators/option-validator";
import { ArrowRight, Check, ChevronsUpDown } from "lucide-react";
import { BASE_PRICE } from "@/config/product";
import { useUploadThing } from "@/lib/uploadthing";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { saveConfig, SaveConfigArgs } from "./action";
import { useRouter } from "next/navigation";

interface DesignConfiguratorProps {
  configId: string;
  imageUrl: string;
  imageDimensions: { width: number; height: number };
}

export default function DesignConfigurator({
  configId,
  imageUrl,
  imageDimensions,
}: DesignConfiguratorProps) {
  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number];
    model: (typeof MODELS.options)[number];
    material?: (typeof MATERIALS.options)[number];
    finish?: (typeof FINISHES.options)[number];
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });

  const router = useRouter();

  const { mutate } = useMutation({
    mutationKey: ["saveConfig"],
    mutationFn: async (args: SaveConfigArgs) => {
      await Promise.all([saveConfiguration(), saveConfig(args)]);
    },
    onError: () => {
      toast.error("Something went wrong while saving your design.");
    },
    onSuccess: () => {
      toast.success("Your design was saved successfully!");
      router.push(`/configure/preview?configId=${configId}`);
    },
  });

  const [renderedDimension, setRenderedDimension] = useState({
    width: imageDimensions.width / 4,
    height: imageDimensions.height / 4,
  });

  const [renderedPosition, setRenderedPosition] = useState({
    x: 150,
    y: 205,
  });

  const phoneCaseRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function base64ToBlob(base64: string, mimeType: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  const { startUpload } = useUploadThing("imageUploader");

  async function saveConfiguration() {
    try {
      const {
        left: caseLeft,
        top: caseTop,
        width,
        height,
      } = phoneCaseRef.current!.getBoundingClientRect();

      const { left: containerLeft, top: containerTop } =
        containerRef.current!.getBoundingClientRect();

      const leftoffset = caseLeft - containerLeft;
      const topOffset = caseTop - containerTop;

      const actualX = renderedPosition.x - leftoffset;
      const actualY = renderedPosition.y - topOffset;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;

      const userImage = new Image();
      userImage.crossOrigin = "anonymous";
      userImage.src = imageUrl;
      await new Promise((resolve) => (userImage.onload = resolve));

      ctx?.drawImage(
        userImage,
        actualX,
        actualY,
        renderedDimension.width,
        renderedDimension.height,
      );

      const base64 = canvas.toDataURL();
      const base64Data = base64.split(",")[1];
      const blob = base64ToBlob(base64Data, "image/png");
      const file = new File([blob], "filename.png", { type: "image/png" });

      // @ts-ignore
      await startUpload([file], { configId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to save your design. Please try again.");
    }
  }

  return (
    <div className="relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20">
      <div
        ref={containerRef}
        className="relative h-150 overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center"
      >
        <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-896/1831">
          <AspectRatio
            ref={phoneCaseRef}
            ratio={896 / 1831}
            className="pointer-events-none relative z-50 w-full"
          >
            <NextImage
              fill
              sizes="100vw"
              alt="phone image"
              src="/phone-template.png"
              className="pointer-events-none z-50 select-none"
            />
          </AspectRatio>
          <div className="absolute z-40 inset-0 left-0.75 top-px right-0.75 bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
          <div
            className={cn(
              "absolute inset-0 left-0.75 top-px right-0.75 bottom-px rounded-[32px]",
              `bg-${options.color.tw}`,
            )}
          />
        </div>
        <Rnd
          className="absolute z-20 border-[3px] border-primary"
          default={{
            x: 150,
            y: 205,
            height: imageDimensions.height / 4,
            width: imageDimensions.width / 4,
          }}
          lockAspectRatio
          resizeHandleComponent={{
            bottomRight: <HandleComponent />,
            bottomLeft: <HandleComponent />,
            topRight: <HandleComponent />,
            topLeft: <HandleComponent />,
          }}
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRenderedDimension({
              width: parseInt(ref.style.width.slice(0, -2)),
              height: parseInt(ref.style.height.slice(0, -2)),
            });
            setRenderedPosition({ x: x, y: y });
          }}
          onDragStop={(_, data) => {
            const { x, y } = data;
            setRenderedPosition({ x: x, y: y });
          }}
        >
          <div className="relative w-full h-full">
            <NextImage
              fill
              sizes="100vw"
              alt="phone image"
              src={imageUrl}
              className="pointer-events-none z-50 select-none object-cover rounded-lg"
            />
          </div>
        </Rnd>
      </div>
      <div className="h-150 w-full col-span-full lg:col-span-1 flex flex-col bg-white min-h-0">
        <ScrollArea className="relative flex-1 min-h-0 overflow-auto">
          <div
            aria-hidden="true"
            className="absolute z-10 inset-x-0 bottom-0 h-12 bg-linear-to-t from-white pointer-events-none"
          />
          <div className="px-8 pb-12 pt-8">
            <h2 className="tracking-tight font-bold text-3xl">
              Customize Your Case
            </h2>
            <div className="w-full h-px bg-zinc-200 my-6" />
            <div className="relative mt-4 flex flex-col gap-6">
              <RadioGroup
                value={options.color}
                onChange={(val) =>
                  setOptions({
                    ...options,
                    color: val,
                  })
                }
              >
                <Label>Color: {options.color.label}</Label>
                <div className="mt-3 flex items-center space-x-3">
                  {COLORS.map((color) => (
                    <Radio
                      key={color.label}
                      value={color}
                      className={({ checked }) =>
                        cn(
                          "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 border-2 border-transparent",
                          {
                            [`border-${color.tw}`]: checked,
                          },
                        )
                      }
                    >
                      <span
                        className={cn(
                          `bg-${color.tw}`,
                          "h-8 w-8 rounded-full border border-black border-opacity-10",
                        )}
                      />
                    </Radio>
                  ))}
                </div>
              </RadioGroup>
              <div className="flex flex-col gap-3 w-full">
                <Label>Model</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      role="combobox"
                    >
                      {options.model.label}
                      <ChevronsUpDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {MODELS.options.map((model) => (
                      <DropdownMenuItem
                        key={model.label}
                        className={cn(
                          "flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-yellow-400",
                          {
                            "bg-purple-100":
                              model.label === options.model.label,
                          },
                        )}
                        onClick={() =>
                          setOptions({
                            ...options,
                            model,
                          })
                        }
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            model.label === options.model.label
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {model.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {[MATERIALS, FINISHES].map(
                ({ name, options: selectableOptions }) => (
                  <RadioGroup
                    key={name}
                    value={options[name]}
                    onChange={(val) => setOptions({ ...options, [name]: val })}
                  >
                    <Label>
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Label>
                    <div className="mt-3 space-y-4">
                      {selectableOptions.map((option) => (
                        <RadioGroup.Option
                          key={option.value}
                          value={option}
                          className={({ checked }) =>
                            cn(
                              "relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 sm:flex sm:justify-between",
                              { "border-primary": checked },
                            )
                          }
                        >
                          <span className="flex flex-col text-sm">
                            <RadioGroup.Label
                              as="span"
                              className="font-medium text-gray-900"
                            >
                              {option.label}
                            </RadioGroup.Label>
                            {option.description && (
                              <RadioGroup.Description
                                as="span"
                                className="text-gray-500"
                              >
                                {option.description}
                              </RadioGroup.Description>
                            )}
                          </span>

                          <RadioGroup.Description
                            as="span"
                            className="mt-2 text-sm sm:text-right"
                          >
                            <span className="font-medium text-gray-900">
                              {formatPrice(option.price / 100)}
                            </span>
                          </RadioGroup.Description>
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                ),
              )}
            </div>
          </div>
        </ScrollArea>
        <div className="w-full px-8 h-16 bg-white shrink-0">
          <div className="h-px w-full bg-zinc-200" />
          <div className="w-full h-full flex items-center">
            <p className="font-medium whitespace-nowrap">
              {formatPrice(
                (BASE_PRICE + options.finish.price + options.material.price) /
                  100,
              )}
            </p>
            <Button
              onClick={() =>
                mutate({
                  configId,
                  color: options.color.value,
                  finish: options.finish.value,
                  material: options.material.value,
                  model: options.model.value,
                })
              }
              className="ml-4 flex-1 cursor-pointer"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-1.5 inline" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
