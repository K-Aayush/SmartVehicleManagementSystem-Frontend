import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CardContent, Card } from "../ui/card";
import { Carousel, CarouselItem, CarouselContent } from "../ui/carousel";
import { testimonials } from "../../lib/data";
import Autoplay from "embla-carousel-autoplay";

const Testimonials = () => {
  const plugin = React.useRef(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Autoplay({ delay: 2000, stopOnInteraction: true }) as unknown as any
  );
  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full mx-auto"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.play}
    >
      <CarouselContent>
        {testimonials.map((testimonial, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <Card className="h-full">
              <CardContent className="flex flex-col justify-between h-full p-6">
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center mt-4">
                  <Avatar className="w-12 h-12 mr-4">
                    <AvatarImage
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default Testimonials;
