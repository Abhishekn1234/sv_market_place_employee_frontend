

import type { BookingConfirmCashPayment } from "../entities/bookingconfirmcashpayment"
import type { BookingConfirmCashPaymentRepo } from "../repositories/BookingConfirmCashPaymentRepo"
export  class BookingConfirmCashPaymentUsecase {
  private BookingconfirmCashPayment:BookingConfirmCashPaymentRepo
  constructor(BookingconfirmCashPayment:BookingConfirmCashPaymentRepo){
    this.BookingconfirmCashPayment=BookingconfirmCashPayment

  }
  async execute(data:BookingConfirmCashPayment){
    return this.BookingconfirmCashPayment.addbookingconfirmcashpayment(data)
  }

}