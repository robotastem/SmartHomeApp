import api from './api';

class WithdrawalService {
  /**
   * Get user wallet balances
   * @returns {Promise} User balance data
   */
  async getUserBalance() {
    try {
      const response = await api.get('/user');
      return {
        success: true,
        data: {
          naira_balance: response.data.results?.data?.wallet_naira || 0,
          usd_balance: response.data.results?.data?.wallet_usd || 0,
          virtual_accounts:
            response.data.results?.data?.virtual_accounts || null,
        },
      };
    } catch (error) {
      console.error('Get user balance error:', error);
      throw error;
    }
  }

  /**
   * Withdraw from virtual account (NGN/USD conversion)
   * @param {Object} data - Withdrawal data
   * @param {string} data.account - Account type ('usd' or 'ngn')
   * @param {number} data.amount - Amount to withdraw
   * @returns {Promise} Withdrawal response
   */
  async withdrawFromVirtualAccount(data) {
    try {
      const response = await api.post('/accounts/withdrawal', data);
      return {
        success: response.data.status,
        message: response.data.message,
        data: response.data,
      };
    } catch (error) {
      console.error('Virtual account withdrawal error:', error);
      throw error;
    }
  }

  /**
   * Withdraw crypto from wallet
   * @param {Object} data - Crypto withdrawal data
   * @param {string} data.coin - Crypto coin (BTC, USDT, ETH, etc.)
   * @param {string} data.to_address - Destination wallet address
   * @param {number} data.amount - Amount to withdraw
   * @returns {Promise} Crypto withdrawal response
   */
  async withdrawCrypto(data) {
    try {
      const response = await api.post('/wallet/withdraw', data);
      return {
        success: response.data.status,
        message: response.data.message,
        data: response.data.results?.data,
      };
    } catch (error) {
      console.error('Crypto withdrawal error:', error);
      throw error;
    }
  }

  /**
   * Get crypto wallet transactions
   * @returns {Promise} Wallet transactions
   */
  async getCryptoWalletTransactions() {
    try {
      const response = await api.get('/wallet/transactions');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Get crypto wallet transactions error:', error);
      throw error;
    }
  }

  /**
   * Get wallet transaction history
   * @returns {Promise} Transaction history
   */
  async getWalletTransactionHistory() {
    try {
      const response = await api.get('/wallet/transactions');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Get wallet transaction history error:', error);
      throw error;
    }
  }

  /**
   * Validate withdrawal amount
   * @param {number} amount - Amount to validate
   * @param {string} currency - Currency type
   * @param {number} balance - Available balance
   * @returns {Object} Validation result
   */
  validateWithdrawalAmount(amount, currency, balance) {
    const errors = [];

    if (!amount || amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (currency === 'NGN' && amount < 100) {
      errors.push('Minimum withdrawal amount is ₦100');
    }

    if (currency === 'USD' && amount < 1) {
      errors.push('Minimum withdrawal amount is $1');
    }

    if (amount > balance) {
      errors.push('Insufficient balance');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate crypto withdrawal
   * @param {Object} data - Crypto withdrawal data
   * @returns {Object} Validation result
   */
  validateCryptoWithdrawal(data) {
    const errors = [];

    if (!data.coin) {
      errors.push('Please select a cryptocurrency');
    }

    if (!data.to_address || data.to_address.length < 10) {
      errors.push('Please enter a valid wallet address');
    }

    if (!data.amount || data.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (data.amount < 0.0001) {
      errors.push('Minimum withdrawal amount is 0.0001');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Format currency amount
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code
   * @returns {string} Formatted amount
   */
  formatCurrency(amount, currency) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'NGN' ? 'NGN' : 'USD',
      minimumFractionDigits: currency === 'NGN' ? 0 : 2,
      maximumFractionDigits: currency === 'NGN' ? 0 : 8,
    });

    return formatter.format(amount);
  }

  /**
   * Get withdrawal types
   * @returns {Array} Available withdrawal types
   */
  getWithdrawalTypes() {
    return [
      {
        id: 'virtual_account',
        name: 'Virtual Account',
        description: 'Convert between NGN and USD',
        icon: '💳',
        color: '#4B39EF',
      },
      {
        id: 'crypto',
        name: 'Crypto Wallet',
        description: 'Withdraw to external crypto wallet',
        icon: '₿',
        color: '#F59E0B',
      },
    ];
  }

  /**
   * Get supported cryptocurrencies
   * @returns {Array} Supported crypto list
   */
  getSupportedCryptos() {
    return [
      {symbol: 'BTC', name: 'Bitcoin', icon: '₿'},
      {symbol: 'USDT', name: 'Tether', icon: '₮'},
      {symbol: 'ETH', name: 'Ethereum', icon: 'Ξ'},
      {symbol: 'BNB', name: 'Binance Coin', icon: '🟡'},
    ];
  }

  /**
   * Calculate conversion rate
   * @param {number} amount - Amount to convert
   * @param {string} fromCurrency - Source currency
   * @param {string} toCurrency - Target currency
   * @param {number} exchangeRate - Exchange rate
   * @returns {Object} Conversion result
   */
  calculateConversion(amount, fromCurrency, toCurrency, exchangeRate = 1000) {
    let convertedAmount = 0;

    if (fromCurrency === 'NGN' && toCurrency === 'USD') {
      convertedAmount = amount / exchangeRate;
    } else if (fromCurrency === 'USD' && toCurrency === 'NGN') {
      convertedAmount = amount * exchangeRate;
    }

    return {
      originalAmount: amount,
      convertedAmount,
      fromCurrency,
      toCurrency,
      exchangeRate,
      fee: 0, // No fees for virtual account conversions
    };
  }

  /**
   * Get withdrawal limits
   * @param {string} type - Withdrawal type
   * @returns {Object} Withdrawal limits
   */
  getWithdrawalLimits(type) {
    const limits = {
      virtual_account: {
        ngn: {min: 100, max: 1000000},
        usd: {min: 1, max: 10000},
      },
      crypto: {
        btc: {min: 0.0001, max: 10},
        usdt: {min: 1, max: 100000},
        eth: {min: 0.001, max: 100},
        bnb: {min: 0.01, max: 1000},
      },
    };

    return limits[type] || {};
  }

  /**
   * Get withdrawal status
   * @param {string} status - Transaction status
   * @returns {Object} Status info
   */
  getWithdrawalStatus(status) {
    const statusMap = {
      pending: {
        label: 'Pending',
        color: '#F59E0B',
        icon: '⏳',
      },
      processing: {
        label: 'Processing',
        color: '#3B82F6',
        icon: '🔄',
      },
      completed: {
        label: 'Completed',
        color: '#10B981',
        icon: '✅',
      },
      failed: {
        label: 'Failed',
        color: '#EF4444',
        icon: '❌',
      },
      cancelled: {
        label: 'Cancelled',
        color: '#6B7280',
        icon: '🚫',
      },
    };

    return statusMap[status] || statusMap.pending;
  }

  /**
   * Get withdrawal history
   * @param {string} type - Withdrawal type filter
   * @returns {Promise} Withdrawal history
   */
  async getWithdrawalHistory(type = 'all') {
    try {
      let response;

      if (type === 'crypto') {
        response = await this.getCryptoWalletTransactions();
      } else {
        response = await this.getWalletTransactionHistory();
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Get withdrawal history error:', error);
      throw error;
    }
  }

  /**
   * Get withdrawal fees
   * @param {string} type - Withdrawal type
   * @param {string} currency - Currency
   * @returns {Object} Fee information
   */
  getWithdrawalFees(type, currency) {
    const fees = {
      virtual_account: {
        ngn: {type: 'percentage', value: 0, min: 0, max: 0},
        usd: {type: 'percentage', value: 0, min: 0, max: 0},
      },
      crypto: {
        btc: {type: 'fixed', value: 0.0001, min: 0.0001, max: 0.001},
        usdt: {type: 'fixed', value: 1, min: 1, max: 10},
        eth: {type: 'fixed', value: 0.001, min: 0.001, max: 0.01},
        bnb: {type: 'fixed', value: 0.01, min: 0.01, max: 0.1},
      },
    };

    return fees[type]?.[currency.toLowerCase()] || {type: 'fixed', value: 0};
  }

  /**
   * Calculate total withdrawal amount including fees
   * @param {number} amount - Base amount
   * @param {Object} fee - Fee structure
   * @returns {Object} Total amount calculation
   */
  calculateTotalWithFees(amount, fee) {
    let feeAmount = 0;

    if (fee.type === 'percentage') {
      feeAmount = (amount * fee.value) / 100;
    } else if (fee.type === 'fixed') {
      feeAmount = fee.value;
    }

    const totalAmount = amount + feeAmount;

    return {
      baseAmount: amount,
      feeAmount,
      totalAmount,
      fee,
    };
  }

  /**
   * Get withdrawal confirmation data
   * @param {Object} withdrawalData - Withdrawal details
   * @returns {Object} Confirmation data
   */
  getWithdrawalConfirmation(withdrawalData) {
    const {type, amount, currency, to_address, coin} = withdrawalData;

    return {
      type,
      amount,
      currency,
      to_address,
      coin,
      timestamp: new Date().toISOString(),
      reference: `WD_${Date.now()}`,
    };
  }

  /**
   * Validate wallet address format
   * @param {string} address - Wallet address
   * @param {string} coin - Cryptocurrency
   * @returns {Object} Validation result
   */
  validateWalletAddress(address, coin) {
    const errors = [];

    if (!address) {
      errors.push('Wallet address is required');
      return {isValid: false, errors};
    }

    // Basic length validation
    if (address.length < 10) {
      errors.push('Invalid wallet address format');
    }

    // Coin-specific validation (basic)
    const coinValidations = {
      BTC: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/,
      ETH: /^0x[a-fA-F0-9]{40}$/,
      USDT: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^0x[a-fA-F0-9]{40}$/,
      BNB: /^bnb[a-z0-9]{39}$|^0x[a-fA-F0-9]{40}$/,
    };

    if (coinValidations[coin] && !coinValidations[coin].test(address)) {
      errors.push(`Invalid ${coin} wallet address format`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get withdrawal processing time
   * @param {string} type - Withdrawal type
   * @returns {string} Processing time estimate
   */
  getProcessingTime(type) {
    const processingTimes = {
      virtual_account: 'Instant',
      crypto: '5-30 minutes',
    };

    return processingTimes[type] || 'Varies';
  }

  /**
   * Get withdrawal requirements
   * @param {string} type - Withdrawal type
   * @returns {Array} Requirements list
   */
  getWithdrawalRequirements(type) {
    const requirements = {
      virtual_account: [
        'Sufficient balance in source account',
        'Valid account type selection',
        'Minimum amount requirements met',
      ],
      crypto: [
        'Valid crypto wallet address',
        'Sufficient crypto balance',
        'Network confirmation',
        'Transaction fees covered',
      ],
    };

    return requirements[type] || [];
  }
}

export default new WithdrawalService();
