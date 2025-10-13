import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "./ui/carousel";

const Slider = ({ products }) => {
    return (
        <>
            <Carousel className="rounded-xl md:max-w-[80%] mx-auto overflow-hidden">

                <CarouselContent>
                    {products && products.map((product) => (
                        <CarouselItem className="flex justify-center" key={product._id}>
                            <img src={`/images/${product.image}`} alt={product.name} className="w-full h-50 md:h-120 object-cover" />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hover:bg-bg" />
                <CarouselNext className="hover:bg-bg" />
            </Carousel>
        </>
    )
}

export default Slider