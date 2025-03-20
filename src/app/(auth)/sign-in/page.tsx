"use client";

import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Form, FormProvider } from "react-hook-form";
import {useForm} from 'react-hook-form'
export default function page() {


  return (
    <div>
        <form >

              <label> 
                Email :
                <input type="email" placeholder="email" />
              </label>

        </form>
    </div>
  );
}
