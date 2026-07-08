import api from "@/api/api";
import type { BookingConfirmCashPayment } from "../../domain/entities/bookingconfirmcashpayment";
import type { BookingConfirmCashPaymentRepo } from "../../domain/repositories/BookingConfirmCashPaymentRepo";
import type {  BookingConfirmCashPaymentResponse  } from "../../domain/entities/bookingconfirmcashpaymentresponse";
export class BookingConfirmCashPaymentRepoImpl implements BookingConfirmCashPaymentRepo {
    async addbookingconfirmcashpayment(data:BookingConfirmCashPayment):Promise<BookingConfirmCashPaymentResponse>{
    const response= await api.post("/booking/confirm-cash-payment",data)
    return response.data
   }   
}