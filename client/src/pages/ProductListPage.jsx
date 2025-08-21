import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { Link, useParams } from 'react-router-dom';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from '../components/Loading';
import CardProduct from '../components/CardProduct';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert';

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const params = useParams();
  const AllSubCategory = useSelector((state) => state.product.allSubCategory || []);
  const [DisplaySubCatory, setDisplaySubCategory] = useState([]);
  const [subCategoryLoading, setSubCategoryLoading] = useState(false);

  const subCategory = params?.subCategory?.split('-');
  const subCategoryName = subCategory?.slice(0, subCategory?.length - 1)?.join(' ') || 'Products';
  const categoryId = params.category?.split('-').slice(-1)[0] || '';
  const subCategoryId = params.subCategory?.split('-').slice(-1)[0] || '';

  const fetchProductdata = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId,
          subCategoryId,
          page,
          limit: 8,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        if (responseData.page === 1) {
          setData(responseData.data);
        } else {
          setData([...data, ...responseData.data]);
        }
        setTotalPage(responseData.totalCount);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    try {
      setSubCategoryLoading(true);
      const response = await Axios({
        ...SummaryApi.getSubCategory, // Assumes SummaryApi.getSubCategory maps to getSubCategoryController
      });

      const { data: responseData } = response;

      if (responseData.success) {
        // Update Redux state via dispatch (assumed to be handled elsewhere)
        // For now, rely on Redux to update AllSubCategory
        console.log('Fetched SubCategories:', responseData.data.map(s => ({ name: s.name, createdAt: s.createdAt })));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setSubCategoryLoading(false);
    }
  };

  useEffect(() => {
    fetchProductdata();
    fetchSubCategories(); // Fetch subcategories on mount and params change
  }, [params]);

  useEffect(() => {
    // Debug: Log AllSubCategory to check Redux state order
    console.log('AllSubCategory:', AllSubCategory.map(s => ({ name: s.name, createdAt: s.createdAt })));

    // Filter subcategories by categoryId and sort by createdAt (newest first)
    const sub = AllSubCategory.filter((s) => {
      const filterData = s.category?.some((el) => el._id === categoryId);
      return filterData || null;
    }).sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA; // Newest first, fallback to epoch if createdAt is missing
    });

    // Debug: Log DisplaySubCatory to verify final order
    console.log('DisplaySubCatory:', sub.map(s => ({ name: s.name, createdAt: s.createdAt })));
    setDisplaySubCategory(sub);
  }, [params, AllSubCategory]);

  return (
    <section className="bg-slate-50">
      <div className="container mx-auto py-2">
        {/* Subcategory Circles */}
        <div className="px-2 pb-2 pt-3">
          <h3 className="font-light font-outfit text-lg mb-2">{subCategoryName}</h3>
          {subCategoryLoading ? (
            <div className="flex justify-center">
              <Loading />
            </div>
          ) : (
            <div className="flex overflow-x-auto space-x-3 pb-2 scrollbarCustom">
              {DisplaySubCatory.map((s, index) => {
                const link = `/${valideURLConvert(s?.category[0]?.name || 'category')}-${s?.category[0]?._id || ''}/${valideURLConvert(s.name || 'subcategory')}-${s._id || ''}`;
                return (
                  <Link
                    key={index}
                    to={link}
                    className="flex flex-col items-center min-w-[120px] p-1 rounded-xl transition-colors"
                  >
                    <div className="w-24 h-24 overflow-hidden shadow">
                      <img
                        src={s.image || '/placeholder.png'}
                        alt={s.name || 'Subcategory'}
                        className="w-full h-full object-scale-down p-1"
                      />
                    </div>
                    <p className="mt-1 font-outfit text-sm text-center">{s.name || 'Subcategory'}</p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              <div className="col-span-full flex justify-center">
                <Loading />
              </div>
            ) : data.length > 0 ? (
              data.map((p, index) => (
                <CardProduct key={p._id + 'product' + index} data={p} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                No products available
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;