import axios from 'axios';
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_URL = 'http://localhost/smart/api';
// Authentication APIs
export const authAPI = {
  // login: async (email, password) => {
  //   try {
  //     const response = await api.post('/login', { email, password });
  //     return { success: true, data: response.data };
  //   } catch (error) {
  //     return { success: false, error: error.response?.data?.message || 'Login failed' };
  //   }
  // },

  // register: async (userData) => {
  //   try {
  //     const response = await api.post('/register', userData);
  //     return { success: true, data: response.data };
  //   } catch (error) {
  //     return { success: false, error: error.response?.data?.message || 'Registration failed' };
  //   }
  // },


 login: async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { email, password }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
  // Log all relevant parts
  console.error('Login error:', {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    headers: error.response?.headers,
    config: error.config,
  });

  return {
    success: false,
    error: error.response?.data?.message || 'Login failed',
  };
}
},


  register: async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  },


  sendOTP: async (data) => {
    try {
      const response = await api.post('/otp', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },


  // Update your resendOTP function to ensure the payload format is correct
resendOTP: async (email) => {
  try {
    // Send the email inside the payload
    const response = await api.post('/resend', { email });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Failed to resend OTP' };
  }
},


  verifyOTP: async (otp) => {
    try {
      const response = await api.post('/verify', { otp });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  createPin: async (pin, confirmPin) => {
    try {
      // Send the POST request with pin and pin_confirmation in the body
      const response = await api.post('/create-pin', {
        pin,
        pin_confirmation: confirmPin,
      });
      return response.data;  // Return the response data from the backend
    } catch (error) {
      console.error('Error creating PIN:', error);
      throw error;  // Propagate the error to be handled elsewhere
    }
  },

  // UploadProfilePic: async (photo) => {
  //   try {
  //     const response = await api.post('/passport', {
  //       photo
  //     });
  //     return response.data;  // Return the response data from the backend
  //   } catch (error) {
  //     console.error('Error Uploading:', error);
  //     throw error;  
  //   }
  // },

  UploadProfilePic: async (formData) => {
  try {
    const response = await api.post('/passport', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error Uploading:', error);
    throw error;
  }
},

  resetPin: async (data) => {
    try {
      const response = await api.post('/reset-pin', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getUser: async () => {
    try {
      const response = await api.get('/user');
      return { success: true, data: response.data };
    } catch (error) {
      // console.log(error)
      return { success: false, error: error.response?.data?.message };
    }
  },

  generateWallet: async () => {
    try {
      const response = await api.post('/user/generate-wallet');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/logout');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  resetOtp: async (email) => {
    try {
      const response = await api.post('/reset/otp', { email });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  resetPassword: async (data) => {
    try {
      const response = await api.post('/reset/password', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  adminLogin: async (email, password) => {
    try {
      const response = await api.post('/adminlogin', { email, password });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Admin login failed' };
    }
  },

  passport: async (passportData) => {
    try {
      const response = await api.post('/passport', passportData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Passport verification failed' };
    }
  },
};





// Lock APIs
export const acctAPI = {

  buy: async (lockData) => {
    try {
      const response = await api.post('/payout/lock', lockData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

};

// Giftcard APIs
export const giftcardAPI = {
//  sell: async (giftcardData) => {
//     try {
//       // Use axios directly to override the default headers from `api.js`
//       const token = await AsyncStorage.getItem('auth_token');

//       // Fallback if token not found
//       const finalToken = token || 'rHJnHSkn8wPU46Exxrr5MZXhnq80KFjlYTvNscx96b8f6ff0';

//       const response = await axios.post(
//         'https://cashpoint.deovaze.com/api/giftcard/sell',
//         giftcardData,
//         {
//           headers: {
//             Accept: 'application/json',
//             Authorization: `Bearer ${finalToken}`,
//             // DO NOT set 'Content-Type' manually!
//             // Let Axios handle it when FormData is passed
//           },
//         }
//       );

//       return { success: true, data: response.data };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.response?.data?.message || 'Something went wrong',
//         data: error.response?.data || {},
//       };
//     }
//   },


sell: async (giftcardData) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const finalToken = token || 'rHJnHSkn8wPU46Exxrr5MZXhnq80KFjlYTvNscx96b8f6ff0';

      const response = await axios.post(
        'https://cashpoint.deovaze.com/api/giftcard/sell',
        giftcardData,
        {
          // headers: {
          //   Accept: 'application/json',
          //   Content-Type: 'application/json',
          //   Authorization: `Bearer ${finalToken}`,
          // },
          headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'Authorization': `Bearer ${finalToken}`,
        },
        }
      );

      return { success: true, data: response.data };
    } catch (error) {
      // 🔥 FULL ERROR LOGGING
      console.error('🔥 Full Axios Error:', error);
      if (error.response) {
        console.error('❌ Response Data:', error.response.data);
        console.error('❌ Status Code:', error.response.status);
        console.error('❌ Headers:', error.response.headers);
      } else if (error.request) {
        console.error('📡 No Response Received. Request:', error.request);
      } else {
        console.error('💥 Error in Setup:', error.message);
      }

      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Something went wrong',
        data: error.response?.data || {},
      };
    }
  },

  
  buy: async (giftcardData) => {
    try {
      const response = await api.post('/giftcard/buy', giftcardData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getTypes: async () => {
    try {
      const response = await api.get('/giftcard/types');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getRates: async () => {
    try {
      const response = await api.get('/giftcard/rates');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getHistory: async () => {
    try {
      const response = await api.get('/giftcard/history');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getDetails: async (id) => {
    try {
      const response = await api.get(`/giftcard/history/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },
};

// Crypto APIs
export const cryptoAPI = {
  sell: async (cryptoData) => {
    try {
      const response = await api.post('/crypto/sell', cryptoData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  buy: async (cryptoData) => {
    try {
      const response = await api.post('/crypto/buy', cryptoData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  generateAddress: async (data) => {
    try {
      const response = await api.post('/crypto/generate-address', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  confirmPayment: async (data) => {
    try {
      const response = await api.post('/crypto/confirm-payment', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getRates: async () => {
    try {
      const response = await api.get('/crypto/rates');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },


    getHistory: async () => {
    try {
      const response = await api.get('/crypto/history');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getDetails: async (id) => {
    try {
      const response = await api.get(`/crypto/history/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

};

// Virtual Account APIs
export const virtualAccountAPI = {
  create: async (data) => {
    try {
      const response = await api.post('/accounts/create', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  withdraw: async (data) => {
    try {
      const response = await api.post('/accounts/withdrawal', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },
};

// Notification APIs
export const notificationAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/notifications');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await api.post(`/notifications/${id}/mark-read`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.post('/notifications/mark-all-read');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },
};


// KYC APIs
export const kycAPI = {
  submitKycTier2: async (data) => {
    try {
      const response = await api.post('/kyc/tier2', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  submitKycTier3: async (data) => {
    try {
      const response = await api.post('/kyc/tier3', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },
};


// VTU APIs
export const vtuAPI = {
  //  buyAirtime: async (data) => {
  //   try {
  //     const response = await api.post('/vtu/airtime', data);
  //     return { success: true, data: response.data };
  //   } catch (error) {
  //     console.log('[BUY AIRTIME FULL ERROR]', error.toJSON?.() || error); // logs full Axios error
  //     return {
  //       success: false,
  //       error: error.response?.data?.message || error.response?.data?.error || 'Something went wrong',
  //     };
  //   }
  // },

  buyAirtime: async (data) => {
    try {
      const response = await api.post('/vtu/airtime', data);
      return { success: true, data: response.data };
    } catch (error) {
      console.log('[BUY AIRTIME FULL ERROR]', error.toJSON?.() || error); // still useful for debugging

      let message = 'Something went wrong';

      if (error.response) {
        // Server responded with a status code outside 2xx
        message = error.response.data?.message || error.response.data?.error || message;
      } else if (error.message === 'Network Error') {
        // No response received at all (e.g., server is unreachable)
        message = 'Network error. Please check your internet connection or try again later.';
      }

      return {
        success: false,
        error: message,
      };
    }
  },

  buyBill: async (data) => {
    try {
      const response = await api.post('/vtu/bill', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  buyCable: async (data) => {
    try {
      const response = await api.post('/vtu/cable', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  buyData: async (data) => {
    try {
      const response = await api.post('/vtu/data', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getDataPlans: async () => {
    try {
      const response = await api.get('/vtu/data/plans');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getDataPlansByNetwork: async (id) => {
    try {
      const response = await api.get(`/vtu/data/plans/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  // verifyBillNo: async (data) => {
  //   try {
  //     const response = await api.post('/vtu/verify', data);
  //     return { success: true, data: response.data };
  //   } catch (error) {
  //     return { success: false, error: error.response?.data?.message };
  //   }
  // },

  verifyBillNo: async (data) => {
  try {
    const response = await api.post('/vtu/verify', data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('🔴 verifyBillNo Error:', error); // Log the full error

    const fallbackMessage = error?.response?.data?.message ||
                            error?.message ||
                            'Unknown error occurred during verification';

    return { success: false, error: fallbackMessage };
  }
},


  getBills: async () => {
    try {
      const response = await api.get('/vtu/bills');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getCables: async () => {
    try {
      const response = await api.get('/vtu/cables');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  

  getCablePlans: async () => {
  try {
    const response = await api.get('/vtu/cable/plans');
    console.log('getCablePlans response:', response.data);  // <-- Log success response
    return { success: true, data: response.data };
  } catch (error) {
    console.error('getCablePlans error:', error.response?.data?.message || error);  // <-- Log error
    return { success: false, error: error.response?.data?.message };
  }
},


  getCablePlanById: async (id) => {
    try {
      const response = await api.get(`/vtu/cable/plan/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getAirtimePercentageById: async (id) => {
    try {
      const response = await api.get(`/vtu/airtime/perc/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getAirtimePercentages: async () => {
    try {
      const response = await api.get('/vtu/airtime/percentages');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getDataHistory: async () => {
    try {
      const response = await api.get('/vtu/data/history');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getDataDetails: async (id) => {
    try {
      const response = await api.get(`/vtu/data/history/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getAirtimeHistory: async () => {
    try {
      const response = await api.get('/vtu/airtime/history');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getAirtimeDetails: async (id) => {
    try {
      const response = await api.get(`/vtu/airtime/history/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getCableHistory: async () => {
    try {
      const response = await api.get('/vtu/cable/history');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getCableDetails: async (id) => {
    try {
      const response = await api.get(`/vtu/cable/history/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getBillHistory: async () => {
    try {
      const response = await api.get('/vtu/bill/history');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getBillDetails: async (id) => {
    try {
      const response = await api.get(`/vtu/bill/history/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },
};




