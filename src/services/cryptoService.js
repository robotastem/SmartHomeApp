import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

class CryptoService {
  /**
   * Get available crypto types
   * @returns {Promise} API response with crypto types
   */
  async getCryptoTypes() {
    try {
      console.log('Fetching crypto types...');
      const response = await api.get('/cryptos');
      console.log('Crypto types response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get crypto types error:', error);
      throw error;
    }
  }

  /**
   * Get current crypto rates
   * @returns {Promise} API response with crypto rates
   */
  async getCryptoRates() {
    try {
      console.log('Fetching crypto rates...');

      // Check if we have a token
      const token = await AsyncStorage.getItem('auth_token');
      console.log('Token exists:', !!token);
      console.log('Token value:', token);

      const response = await api.get('/crypto/rates');
      console.log('Crypto rates response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get crypto rates error:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);

      // Return fallback rates if API fails
      return {
        status: false,
        results: {
          data: {
            BTC: 60000,
            USDT: 1,
            BNB: 300,
          },
        },
      };
    }
  }

  /**
   * Buy crypto using wallet withdraw
   * @param {Object} data - Buy data
   * @param {string} data.coin - Coin type (BTC, USDT, BNB)
   * @param {string} data.to_address - Destination wallet address
   * @param {number} data.amount - Amount to buy
   * @returns {Promise} API response
   */
  async buyCrypto(data) {
    try {
      console.log('Buying crypto with data:', data);
      const response = await api.post('/wallet/withdraw', data);
      console.log('Buy crypto response:', response);
      return response.data;
    } catch (error) {
      console.error('Buy crypto error:', error);
      // Return a consistent error format
      if (error.response?.data) {
        throw new Error(error.response.data.error || 'Failed to buy crypto');
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  /**
   * Complete buy crypto flow - Withdraw from wallet
   * @param {Object} data - Buy data
   * @param {string} data.coin - Coin type (BTC, USDT, BNB)
   * @param {string} data.to_address - Destination wallet address
   * @param {number} data.amount - Amount to buy
   * @returns {Promise} API response
   */
  async completeBuyCryptoFlow(data) {
    try {
      console.log('Starting complete buy crypto flow with data:', data);

      // Validate the data first
      const validation = this.validateBuyData(data);
      if (!validation.isValid) {
        throw new Error(
          `Validation failed: ${Object.values(validation.errors).join(', ')}`,
        );
      }

      // Check wallet balance before proceeding
      const balanceCheck = await this.checkWalletBalance(data.coin);
      if (!balanceCheck.success || balanceCheck.balance < data.amount) {
        throw new Error(
          `Insufficient balance. Available: ${balanceCheck.balance} ${data.coin}, Required: ${data.amount} ${data.coin}`,
        );
      }

      // Execute the buy
      const response = await this.buyCrypto(data);
      console.log('Buy crypto completed:', response);

      return {
        success: true,
        transaction: response,
        message: `Successfully initiated ${data.amount} ${data.coin} withdrawal to ${data.to_address}`,
      };
    } catch (error) {
      console.error('Complete buy crypto flow error:', error);
      throw error;
    }
  }

  // /**
  //  * Sell crypto - Step 1: Create wallet address
  //  * @param {Object} data - Sell data
  //  * @param {string} data.coin - Coin type (BTC, USDT, BNB)
  //  * @returns {Promise} API response
  //  */
  // async sellCrypto(data) {
  //   try {
  //     console.log('Creating wallet for crypto sell with data:', data);
  //     const response = await api.post('/wallet/create', data);
  //     console.log('Create wallet for sell response:', response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Create wallet for sell error:', error);
  //     // Return a consistent error format
  //     if (error.response?.data) {
  //       throw new Error(
  //         error.response.data.message || 'Failed to create wallet for sell',
  //       );
  //     }
  //     throw new Error('Network error. Please check your connection.');
  //   }
  // }


  /**
 * Sell crypto - Step 1: Create wallet trade, Step 2: Get deposit address
 * @param {string} coinSymbol - Coin symbol (BTC or USDT)
 * @returns {Promise} Wallet trade info + deposit address
 */
async sellCrypto(coinSymbol) {
  try {
    console.log('Starting sell process for:', coinSymbol);

    // Step 1: Create wallet (submit trade)
    const tradeRes = await api.post('/wallet/create', { coin: coinSymbol });
    console.log('Wallet create response:', tradeRes.data);

    if (!tradeRes.data?.status) {
      throw new Error(tradeRes.data?.message || 'Failed to initiate trade');
    }

    // Step 2: Get deposit address
    const blockchain = coinSymbol.toLowerCase(); // e.g. BTC -> btc
    const addressRes = await api.post('/wallet/deposit', { blockchain });

    if (!addressRes.data?.status) {
      throw new Error(
        addressRes.data?.message || 'Failed to get deposit address',
      );
    }

    return {
      status: true,
      trade: tradeRes.data?.results?.data,
      address: addressRes.data?.results?.address,
      message: addressRes.data?.message,
    };
  } catch (error) {
    console.error('Sell crypto error:', error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        'Sell process failed. Please try again.',
    );
  }
}


  /**
   * Get deposit address for selling crypto - Step 2
   * @param {Object} data - Deposit data
   * @param {string} data.coin - Coin type
   * @returns {Promise} API response
   */
  async getSellDepositAddress(data) {
    try {
      console.log('Getting deposit address for sell with data:', data);
      const response = await api.post('/wallet/deposit', data);
      console.log('Get deposit address response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get deposit address error:', error);
      // Return a consistent error format
      if (error.response?.data) {
        throw new Error(
          error.response.data.message || 'Failed to get deposit address',
        );
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  /**
   * Complete sell crypto flow - Create wallet and get deposit address
   * @param {Object} data - Sell data
   * @param {string} data.coin - Coin type (BTC, USDT, BNB)
   * @returns {Promise} API response with wallet and deposit address
   */
  async completeSellCryptoFlow(data) {
    try {
      console.log('Starting complete sell crypto flow with data:', data);

      // Step 1: Create wallet
      const walletResponse = await this.sellCrypto(data);
      console.log('Wallet created:', walletResponse);

      // Step 2: Get deposit address
      const depositResponse = await this.getSellDepositAddress(data);
      console.log('Deposit address received:', depositResponse);

      return {
        success: true,
        wallet: walletResponse,
        depositAddress: depositResponse,
        message: `Send ${data.coin} to the provided address to complete your sell order`,
      };
    } catch (error) {
      console.error('Complete sell crypto flow error:', error);
      throw error;
    }
  }

  /**
   * Generate wallet address for crypto payment
   * @param {Object} data - Wallet data
   * @param {string} data.coin - Coin type (USDT, BTC, BNB)
   * @param {number} data.amount_ngn - Amount in NGN
   * @returns {Promise} API response
   */
  async generateWalletAddress(data) {
    try {
      const response = await api.post('/crypto/generate-address', data);
      return response.data;
    } catch (error) {
      console.error('Generate wallet address error:', error);
      throw error;
    }
  }

  /**
   * Confirm crypto payment
   * @param {Object} data - Payment confirmation data
   * @param {string} data.wallet_address - Wallet address
   * @param {string} data.tx_hash - Transaction hash
   * @returns {Promise} API response
   */
  async confirmPayment(data) {
    try {
      const response = await api.post('/crypto/confirm-payment', data);
      return response.data;
    } catch (error) {
      console.error('Confirm payment error:', error);
      throw error;
    }
  }

  /**
   * Get user's crypto transaction history
   * @returns {Promise} API response with crypto history
   */
  async getCryptoHistory() {
    try {
      console.log('Fetching crypto history...');
      const response = await api.get('/crypto/history');
      console.log('Crypto history response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get crypto history error:', error);
      throw error;
    }
  }

  /**
   * Get specific crypto transaction details
   * @param {number} id - Transaction ID
   * @returns {Promise} API response with transaction details
   */
  async getCryptoDetails(id) {
    try {
      console.log('Fetching crypto details for ID:', id);
      const response = await api.get(`/crypto/history/${id}`);
      console.log('Crypto details response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get crypto details error:', error);
      throw error;
    }
  }

  /**
   * Buy BTC using Coinbase
   * @param {Object} data - Buy data
   * @param {number} data.amount_usd - Amount in USD
   * @returns {Promise} API response
   */
  async buyBTC(data) {
    try {
      const response = await api.post('/crypto/buy-btc', data);
      return response.data;
    } catch (error) {
      console.error('Buy BTC error:', error);
      throw error;
    }
  }

  /**
   * Sell BTC using Coinbase
   * @param {Object} data - Sell data
   * @param {number} data.amount_btc - Amount of BTC to sell
   * @returns {Promise} API response
   */
  async sellBTC(data) {
    try {
      const response = await api.post('/crypto/sell-btc', data);
      return response.data;
    } catch (error) {
      console.error('Sell BTC error:', error);
      throw error;
    }
  }

  /**
   * Create crypto wallet
   * @param {Object} data - Wallet data
   * @param {string} data.coin - Coin type
   * @returns {Promise} API response
   */
  async createWallet(data) {
    try {
      const response = await api.post('/wallet/create', data);
      return response.data;
    } catch (error) {
      console.error('Create wallet error:', error);
      throw error;
    }
  }

  /**
   * Get wallet deposit address
   * @param {Object} data - Deposit data
   * @param {string} data.coin - Coin type
   * @returns {Promise} API response
   */
  async getDepositAddress(data) {
    try {
      const response = await api.post('/wallet/deposit', data);
      return response.data;
    } catch (error) {
      console.error('Get deposit address error:', error);
      throw error;
    }
  }

  /**
   * Withdraw from wallet
   * @param {Object} data - Withdraw data
   * @param {string} data.coin - Coin type
   * @param {string} data.to_address - Destination address
   * @param {number} data.amount - Amount to withdraw
   * @returns {Promise} API response
   */
  async withdrawFromWallet(data) {
    try {
      console.log('Withdrawing from wallet with data:', data);
      const response = await api.post('/wallet/withdraw', data);
      console.log('Withdraw response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Withdraw from wallet error:', error);
      // Return a consistent error format
      if (error.response?.data) {
        throw new Error(
          error.response.data.message || 'Failed to withdraw from wallet',
        );
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  /**
   * Get wallet transactions
   * @returns {Promise} API response with wallet transactions
   */
  async getWalletTransactions() {
    try {
      const response = await api.get('/wallet/transactions');
      return response.data;
    } catch (error) {
      console.error('Get wallet transactions error:', error);
      throw error;
    }
  }

  /**
   * Check wallet balance for a specific coin
   * @param {string} coin - Coin type to check balance for
   * @returns {Promise} API response with wallet balance
   */
  async checkWalletBalance(coin) {
    try {
      console.log('Checking wallet balance for coin:', coin);
      const response = await api.get('/wallet/transactions');
      const wallets = response.data;

      // Find the wallet for the specific coin
      const wallet = wallets.find(w => w.coin === coin.toUpperCase());

      if (!wallet) {
        return {
          success: false,
          balance: 0,
          message: `No wallet found for ${coin}`,
        };
      }

      return {
        success: true,
        balance: wallet.balance || 0,
        wallet: wallet,
        message: `Balance for ${coin}: ${wallet.balance || 0}`,
      };
    } catch (error) {
      console.error('Check wallet balance error:', error);
      throw error;
    }
  }

  /**
   * Validate crypto buy data
   * @param {Object} data - Buy data to validate
   * @returns {Object} Validation result
   */
  validateBuyData(data) {
    const errors = {};

    if (!data.coin) {
      errors.coin = 'Please select a cryptocurrency';
    }
    if (!data.to_address) {
      errors.to_address = 'Destination wallet address is required';
    }
    if (!data.amount || data.amount < 0.0001) {
      errors.amount = 'Amount must be at least 0.0001';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate crypto sell data
   * @param {Object} data - Sell data to validate
   * @returns {Object} Validation result
   */
  validateSellData(data) {
    const errors = {};

    if (!data.coin) {
      errors.coin = 'Please select a cryptocurrency';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate wallet address generation data
   * @param {Object} data - Wallet data to validate
   * @returns {Object} Validation result
   */
  validateWalletData(data) {
    const errors = {};

    if (!data.coin) {
      errors.coin = 'Please select a coin type';
    }
    if (!data.amount_ngn || data.amount_ngn < 1) {
      errors.amount_ngn = 'Amount must be at least ₦1';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Format crypto amount for display
   * @param {number} amount - Amount to format
   * @param {string} symbol - Crypto symbol
   * @returns {string} Formatted amount
   */
  formatCryptoAmount(amount, symbol) {
    if (!amount) return '0.00';

    const decimals = symbol === 'BTC' ? 8 : 2;
    return parseFloat(amount).toFixed(decimals);
  }

  /**
   * Format USD amount for display
   * @param {number} amount - Amount to format
   * @returns {string} Formatted amount
   */
  formatUSDAmount(amount) {
    if (!amount) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
  }

  /**
   * Format NGN amount for display
   * @param {number} amount - Amount to format
   * @returns {string} Formatted amount
   */
  formatNGNAmount(amount) {
    if (!amount) return '₦0.00';
    return `₦${parseFloat(amount).toLocaleString('en-NG', {
      minimumFractionDigits: 2,
    })}`;
  }

  /**
   * Get transaction status color
   * @param {string} status - Transaction status
   * @returns {string} Color code
   */
  getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'failed':
        return '#F44336';
      case 'cancelled':
        return '#9E9E9E';
      default:
        return '#9E9E9E';
    }
  }

  /**
   * Get transaction status text
   * @param {string} status - Transaction status
   * @returns {string} Status text
   */
  getStatusText(status) {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  /**
   * Get transaction type text
   * @param {string} type - Transaction type
   * @returns {string} Type text
   */
  getTypeText(type) {
    switch (type?.toLowerCase()) {
      case 'buy':
        return 'Buy';
      case 'sell':
        return 'Sell';
      case 'withdraw':
        return 'Withdraw';
      case 'deposit':
        return 'Deposit';
      default:
        return 'Transaction';
    }
  }

  /**
   * Calculate conversion rate
   * @param {number} amount - Amount to convert
   * @param {number} rate - Conversion rate
   * @returns {number} Converted amount
   */
  calculateConversion(amount, rate) {
    if (!amount || !rate) return 0;
    return amount * rate;
  }

  /**
   * Get supported coin types
   * @returns {Array} Array of supported coins
   */
  getSupportedCoins() {
    return [
      {label: 'Bitcoin', value: 'BTC', symbol: 'BTC'},
      {label: 'Tether', value: 'USDT', symbol: 'USDT'},
      {label: 'Binance Coin', value: 'BNB', symbol: 'BNB'},
    ];
  }

  /**
   * Get all wallet information
   * @returns {Promise} API response with all wallets
   */
  async getAllWallets() {
    try {
      console.log('Getting all wallets...');
      const response = await api.get('/wallet/transactions');
      console.log('All wallets response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get all wallets error:', error);
      throw error;
    }
  }

  /**
   * Get wallet summary with balances for all coins
   * @returns {Promise} API response with wallet summary
   */
  async getWalletSummary() {
    try {
      console.log('Getting wallet summary...');
      const wallets = await this.getAllWallets();

      const summary = {
        totalWallets: wallets.length,
        wallets: wallets.map(wallet => ({
          coin: wallet.coin,
          balance: wallet.balance || 0,
          address: wallet.address,
          createdAt: wallet.created_at,
        })),
        totalBalance: wallets.reduce(
          (sum, wallet) => sum + (wallet.balance || 0),
          0,
        ),
      };

      return {
        success: true,
        summary: summary,
        message: `Found ${summary.totalWallets} wallets with total balance of ${summary.totalBalance}`,
      };
    } catch (error) {
      console.error('Get wallet summary error:', error);
      throw error;
    }
  }

  /**
   * Test API connection with token
   * @returns {Promise} Test response
   */
  async testApiConnection() {
    try {
      console.log('Testing API connection...');
      const response = await api.get('/user');
      console.log('API test response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API test error:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  }
}

export default new CryptoService();
