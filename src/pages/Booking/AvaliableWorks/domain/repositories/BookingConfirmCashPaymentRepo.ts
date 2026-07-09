import type { BookingConfirmCashPayment } from "../entities/bookingconfirmcashpayment"
import type { BookingConfirmCashPaymentResponse  } from "../entities/bookingconfirmcashpaymentresponse"

export interface BookingConfirmCashPaymentRepo{
    addbookingconfirmcashpayment:(data:BookingConfirmCashPayment)=>Promise<BookingConfirmCashPaymentResponse>
}