import React, { useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import AddAddress from "../components/AddAddress";
import { useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } =
    useGlobalContext();

  const [openAddress, setOpenAddress] = useState(false);
  const [isLoadingOnline, setIsLoadingOnline] = useState(false); // Loading state for online payment
  const [isLoadingCOD, setIsLoadingCOD] = useState(false); // Loading state for cash on delivery
  const addressList = useSelector((state) => state.addresses.addressList);
  const [selectAddress, setSelectAddress] = useState(0);
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const navigate = useNavigate();

  // Get product name for Razorpay heading (using first item or a fallback)
  const productName = cartItemsList.length > 0 ? cartItemsList[0].name : "BmTechx Order";

  const handleCashOnDelivery = async () => {
    // Check if addressList is empty or no valid address is selected
    if (!addressList.length || !addressList[selectAddress]?._id) {
      toast.error("Please select or add a delivery address");
      return;
    }

    setIsLoadingCOD(true); // Start loading
    try {
      const response = await Axios({
        url: "/api/order/cash-on-delivery",
        method: "post",
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchCartItem?.();
        fetchOrder?.();
        navigate("/", {
          state: { text: "Order" },
        });
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setIsLoadingCOD(false); // Stop loading
    }
  };

  const handleOnlinePayment = async () => {
    // Check if addressList is empty or no valid address is selected
    if (!addressList.length || !addressList[selectAddress]?._id) {
      toast.error("Please select or add a delivery address");
      return;
    }

    setIsLoadingOnline(true); // Start loading
    try {
      const response = await Axios({
        url: "/api/order/checkout",
        method: "post",
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
        },
      });

      const { data: responseData } = response;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: responseData.amount,
        currency: "INR",
        name: productName, // Use dynamic product name
        description: "Order Payment",
        order_id: responseData.id,
        handler: async function (response) {
          try {
            const verifyResponse = await Axios({
              url: "/api/order/checkout",
              method: "post",
              data: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                list_items: cartItemsList,
                addressId: addressList[selectAddress]?._id,
              },
            });

            if (verifyResponse.data.success) {
              toast.success("Payment successful!");
              fetchCartItem?.();
              fetchOrder?.();
              navigate("/", {
                state: { text: "Order" },
              });
            }
          } catch (error) {
            AxiosToastError(error);
          } finally {
            setIsLoadingOnline(false); // Stop loading
          }
        },
        prefill: {
          email: responseData.email,
        },
        theme: {
          color: "#3B82F6",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      AxiosToastError(error);
      setIsLoadingOnline(false); // Stop loading on error
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-tr from-blue-50 to-white py-10">
      <div className="container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-10">
        {/* Address Section */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-5">Select Delivery Address</h2>
          <div className="bg-white shadow rounded-xl p-6 space-y-4">
            {addressList.map((address, index) => (
              <label
                key={index}
                htmlFor={`address${index}`}
                className={`border rounded-xl p-5 cursor-pointer block transition-all duration-200 hover:border-blue-400 ${
                  selectAddress == index ? "border-blue-500 bg-blue-50" : "border-gray-200"
                } ${!address.status && "hidden"}`}
              >
                <div className="flex gap-4 items-start">
                  <input
                    id={`address${index}`}
                    type="radio"
                    value={index}
                    checked={selectAddress == index}
                    onChange={(e) => setSelectAddress(e.target.value)}
                    name="address"
                    className="accent-blue-600 mt-1"
                  />
                  <div className="text-sm text-gray-700 space-y-1">
                    <p className="font-semibold">{address.address_line}</p>
                    <p>
                      {address.city}, {address.state}
                    </p>
                    <p>
                      {address.country} - {address.pincode}
                    </p>
                    <p className="text-gray-500">Mobile: {address.mobile}</p>
                  </div>
                </div>
              </label>
            ))}

            <div
              onClick={() => setOpenAddress(true)}
              className="border-2 border-dashed border-blue-400 text-blue-600 rounded-xl flex items-center justify-center h-14 cursor-pointer hover:bg-blue-50 transition"
            >
              + Add New Address
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="w-full max-w-md">
          <div className="bg-white shadow-lg rounded-xl p-6 sticky top-20">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Summary</h2>

            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Items Total</span>
                <span>
                  <span className="line-through text-gray-400 mr-2">
                    {DisplayPriceInRupees(notDiscountTotalPrice)}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {DisplayPriceInRupees(totalPrice)}
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span>Quantity</span>
                <span>{totalQty} items</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>

              <div className="border-t pt-4 flex justify-between text-base font-semibold text-gray-900">
                <span>Grand Total</span>
                <span>{DisplayPriceInRupees(totalPrice)}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleOnlinePayment}
                disabled={isLoadingOnline}
                className={`w-full py-3 bg-blue-600 text-white rounded-lg font-semibold transition flex items-center justify-center ${
                  isLoadingOnline ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
              >
                {isLoadingOnline ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Pay Online"
                )}
              </button>
              <button
                onClick={handleCashOnDelivery}
                disabled={isLoadingCOD}
                className={`w-full py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold transition flex items-center justify-center ${
                  isLoadingCOD ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50"
                }`}
              >
                {isLoadingCOD ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Cash on Delivery"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;