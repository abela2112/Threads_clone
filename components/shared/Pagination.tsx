"use client"
import { useRouter } from 'next/navigation';
import React from 'react'
import { Button } from '../ui/button';
interface PaginationProps {
    pageNumber: number;
    isNext: boolean;
    path: string;

    
}
const Pagination = ({pageNumber, isNext, path}: PaginationProps) => {
    const router=useRouter()
    const handleNavigation = (type: string) => {
let nextPage = pageNumber;
        if (type === "prev") {
            nextPage = Math.max(1, pageNumber - 1);
        } else if(type === "next") {
            nextPage = pageNumber + 1;
        }

        if(nextPage >1){
router.push(`/${path}?page=${nextPage}`)
        }
        else {
            router.push(`/${path}`)
        }

        
    }
    if(!isNext && pageNumber === 1) {
       return null
    }
    return (
        <div className='pagination'>
          <Button
            onClick={() => handleNavigation("prev")}
            disabled={pageNumber === 1}
            className='!text-small-regular text-light-2'
          >
            Prev
          </Button>
          <p className='text-small-semibold text-light-1'>{pageNumber}</p>
          <Button
            onClick={() => handleNavigation("next")}
            disabled={!isNext}
            className='!text-small-regular text-light-2'
          >
            Next
          </Button>
        </div>
      );
}

export default Pagination