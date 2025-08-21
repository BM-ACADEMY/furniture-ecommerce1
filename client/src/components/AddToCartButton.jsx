import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../provider/GlobalProvider';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from './Loading';
import { useSelector } from 'react-redux';
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';

const AddToCartButton = ({ data, buttonColor = '#16a34a', hoverColor = '#15803d', textColor = 'white' }) => {
  const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const cartItem = useSelector(state => state.cartItem.cart);
  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [qty, setQty] = useState(0);
  const [cartItemDetails, setCartItemsDetails] = useState();
  const navigate = useNavigate();

  const handleADDTocart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addTocart,
        data: {
          productId: data?._id
        }
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchCartItem) {
          fetchCartItem();
        }
      }
    } catch (error) {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkingitem = cartItem.some(item => item.productId._id === data._id);
    setIsAvailableCart(checkingitem);

    const product = cartItem.find(item => item.productId._id === data._id);
    setQty(product?.quantity);
    setCartItemsDetails(product);
  }, [data, cartItem]);

  const increaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const response = await updateCartItem(cartItemDetails?._id, qty + 1);
    if (response.success) {
      toast.success("Item added");
    }
  };

  const decreaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (qty === 1) {
      deleteCartItem(cartItemDetails?._id);
    } else {
      const response = await updateCartItem(cartItemDetails?._id, qty - 1);
      if (response.success) {
        toast.success("Item removed");
      }
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '150px' }}>
      {isAvailableCart ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <Button
            onClick={decreaseQty}
            variant="contained"
            sx={{
              flex: 1,
              minWidth: 0,
              padding: { xs: '4px', lg: '6px' },
              borderRadius: '4px 0 0 4px',
              bgcolor: buttonColor,
              '&:hover': { bgcolor: hoverColor },
              color: textColor,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: { xs: '32px', lg: '36px' }
            }}
          >
            <FaMinus size={14} />
          </Button>
          <Typography
            sx={{
              flex: 1,
              textAlign: 'center',
              fontWeight: 'medium',
              px: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.100',
              height: { xs: '32px', lg: '36px' },
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'grey.300'
            }}
          >
            {qty}
          </Typography>
          <Button
            onClick={increaseQty}
            variant="contained"
            sx={{
              flex: 1,
              minWidth: 0,
              padding: { xs: '4px', lg: '6px' },
              borderRadius: '0 4px 4px 0',
              bgcolor: buttonColor,
              '&:hover': { bgcolor: hoverColor },
              color: textColor,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: { xs: '32px', lg: '36px' }
            }}
          >
            <FaPlus size={14} />
          </Button>
        </Box>
      ) : (
        <Button
          onClick={handleADDTocart}
          variant="contained"
          sx={{
            width: '100%',
            px: { xs: 2, lg: 4 },
            py: 1,
            borderRadius: '4px',
            bgcolor: buttonColor,
            '&:hover': { bgcolor: hoverColor },
            color: textColor,
            fontSize: { xs: '0.875rem', lg: '1rem' },
            textTransform: 'none'
          }}
          disabled={loading}
        >
          {loading ? <Loading /> : "Add to Cart"}
        </Button>
      )}
    </Box>
  );
};

export default AddToCartButton;