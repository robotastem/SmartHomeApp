import api from './api';

class KYCService {
  /**
   * Submit Tier 2 KYC verification
   * @param {Object} data - KYC data
   * @param {string} data.id_type - Type of ID (nin, bvn, driver_license, passport)
   * @param {Object} data.photo - Image file object
   * @returns {Promise} API response
   */
  async submitTier2KYC(data) {
    try {
      const formData = new FormData();
      formData.append('id_type', data.id_type);
      formData.append('photo', {
        uri: data.photo.uri,
        type: data.photo.type || 'image/jpeg',
        name: data.photo.fileName || 'kyc_photo.jpg',
      });

      const response = await api.post('/kyc/tier2', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Tier 2 KYC submission error:', error);
      throw error;
    }
  }

  /**
   * Submit Tier 3 KYC verification
   * @param {Object} data - KYC data
   * @param {Object} data.address_prove - Address proof image
   * @param {Object} data.fund_prove - Fund proof image
   * @returns {Promise} API response
   */
  async submitTier3KYC(data) {
    try {
      const formData = new FormData();
      formData.append('address_prove', {
        uri: data.address_prove.uri,
        type: data.address_prove.type || 'image/jpeg',
        name: data.address_prove.fileName || 'address_proof.jpg',
      });
      formData.append('fund_prove', {
        uri: data.fund_prove.uri,
        type: data.fund_prove.type || 'image/jpeg',
        name: data.fund_prove.fileName || 'fund_proof.jpg',
      });

      const response = await api.post('/kyc/tier3', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Tier 3 KYC submission error:', error);
      throw error;
    }
  }

  /**
   * Get user's current KYC status
   * @returns {Promise} User data with KYC information
   */
  async getUserKYCStatus() {
    try {
      const response = await api.get('/user');
      return response.data;
    } catch (error) {
      console.error('Get user KYC status error:', error);
      throw error;
    }
  }

  /**
   * Get available ID types for KYC
   * @returns {Array} Array of ID type options
   */
  getIDTypes() {
    return [
      {label: 'NIN Card / Slip', value: 'nin', icon: 'card'},
      {label: "Driver's License", value: 'driver_license', icon: 'car'},
      {label: 'BVN Number', value: 'bvn', icon: 'key'},
      {label: 'Passport', value: 'passport', icon: 'globe'},
    ];
  }

  /**
   * Validate KYC data before submission
   * @param {Object} data - KYC data to validate
   * @param {number} tier - KYC tier (2 or 3)
   * @returns {Object} Validation result
   */
  validateKYCData(data, tier) {
    const errors = {};

    if (tier === 2) {
      if (!data.id_type) {
        errors.id_type = 'Please select an ID type';
      }
      if (!data.photo) {
        errors.photo = 'Please upload your ID photo';
      }
    } else if (tier === 3) {
      if (!data.address_prove) {
        errors.address_prove = 'Please upload proof of address';
      }
      if (!data.fund_prove) {
        errors.fund_prove = 'Please upload proof of fund source';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Get KYC tier limits
   * @param {number} tier - KYC tier
   * @returns {Object} Tier limits
   */
  getTierLimits(tier) {
    const limits = {
      1: {
        dailyLimit: '₦ 50,000.00',
        maxBalance: '₦ 300,000.00',
        description: 'Basic verification completed',
      },
      2: {
        dailyLimit: '₦ 200,000.00',
        maxBalance: '₦ 500,000.00',
        description: 'ID verification completed',
      },
      3: {
        dailyLimit: '₦ 5,000,000.00',
        maxBalance: 'Unlimited',
        description: 'Full verification completed',
      },
    };

    return limits[tier] || limits[1];
  }

  /**
   * Get next tier information
   * @param {number} currentTier - Current KYC tier
   * @returns {Object|null} Next tier info or null if max tier
   */
  getNextTierInfo(currentTier) {
    if (currentTier >= 3) return null;

    const nextTier = currentTier + 1;
    return {
      tier: nextTier,
      limits: this.getTierLimits(nextTier),
      requirements:
        nextTier === 2
          ? ['Valid ID document', 'Selfie verification']
          : ['Proof of address', 'Source of fund verification'],
    };
  }
}

export default new KYCService();
