import api from './api';

class LeaderboardService {
  /**
   * Get leaderboard data based on user transaction success
   * Note: This is a mock implementation since we don't have access to all users' data
   * In a real implementation, you would need a dedicated leaderboard endpoint
   * @returns {Promise} API response with leaderboard data
   */
  async getLeaderboard() {
    try {
      // For now, return mock data since we can't access all users' transaction histories
      // In a real implementation, you would call a dedicated leaderboard endpoint
      const mockLeaderboard = this.generateMockLeaderboard();

      return {
        success: true,
        data: mockLeaderboard,
      };
    } catch (error) {
      console.error('Get leaderboard error:', error);
      throw error;
    }
  }

  /**
   * Get current user's giftcard histories
   * @returns {Promise} Giftcard histories
   */
  async getGiftcardHistories() {
    try {
      const response = await api.get('/giftcard/history');
      return response.data;
    } catch (error) {
      console.error('Get giftcard histories error:', error);
      return {success: false, results: {data: []}};
    }
  }

  /**
   * Get current user's crypto histories
   * @returns {Promise} Crypto histories
   */
  async getCryptoHistories() {
    try {
      const response = await api.get('/crypto/history');
      return response.data;
    } catch (error) {
      console.error('Get crypto histories error:', error);
      return {success: false, results: {data: []}};
    }
  }

  /**
   * Generate mock leaderboard data for demonstration
   * In a real implementation, this would come from a dedicated leaderboard endpoint
   * @returns {Array} Mock leaderboard data
   */
  generateMockLeaderboard() {
    const mockUsers = [
      {
        user_id: 1,
        username: 'CryptoKing',
        avatar: null,
        total_points: 156750,
        giftcard_points: 45000,
        crypto_points: 111750,
        giftcard_transactions: 12,
        crypto_transactions: 8,
        rank: 1,
        color: '#FFA500',
      },
      {
        user_id: 2,
        username: 'GiftCardPro',
        avatar: null,
        total_points: 128900,
        giftcard_points: 95000,
        crypto_points: 33900,
        giftcard_transactions: 18,
        crypto_transactions: 5,
        rank: 2,
        color: '#4B39EF',
      },
      {
        user_id: 3,
        username: 'TradingMaster',
        avatar: null,
        total_points: 98750,
        giftcard_points: 32000,
        crypto_points: 66750,
        giftcard_transactions: 8,
        crypto_transactions: 12,
        rank: 3,
        color: '#EF4444',
      },
      {
        user_id: 4,
        username: 'BitcoinBull',
        avatar: null,
        total_points: 75600,
        giftcard_points: 15000,
        crypto_points: 60600,
        giftcard_transactions: 5,
        crypto_transactions: 15,
        rank: 4,
        color: '#9CA3AF',
      },
      {
        user_id: 5,
        username: 'CardCollector',
        avatar: null,
        total_points: 62300,
        giftcard_points: 58000,
        crypto_points: 4300,
        giftcard_transactions: 22,
        crypto_transactions: 2,
        rank: 5,
        color: '#9CA3AF',
      },
    ];

    return mockUsers;
  }

  /**
   * Calculate points for each user based on successful transactions
   * @param {Object} giftcardData - Giftcard transaction data
   * @param {Object} cryptoData - Crypto transaction data
   * @returns {Object} User points mapping
   */
  calculateUserPoints(giftcardData, cryptoData) {
    const userPoints = {};

    // Process giftcard transactions
    if (giftcardData.success && giftcardData.results?.data) {
      giftcardData.results.data.forEach(transaction => {
        if (
          transaction.status === 'approved' ||
          transaction.status === 'completed'
        ) {
          const userId = transaction.user_id;
          const points = this.calculateGiftcardPoints(transaction);

          if (!userPoints[userId]) {
            userPoints[userId] = {
              user_id: userId,
              username: transaction.user?.username || `User${userId}`,
              avatar: transaction.user?.avatar || null,
              total_points: 0,
              giftcard_points: 0,
              crypto_points: 0,
              giftcard_transactions: 0,
              crypto_transactions: 0,
            };
          }

          userPoints[userId].total_points += points;
          userPoints[userId].giftcard_points += points;
          userPoints[userId].giftcard_transactions += 1;
        }
      });
    }

    // Process crypto transactions
    if (cryptoData.success && cryptoData.results?.data) {
      cryptoData.results.data.forEach(transaction => {
        if (transaction.status === 'completed') {
          const userId = transaction.user_id;
          const points = this.calculateCryptoPoints(transaction);

          if (!userPoints[userId]) {
            userPoints[userId] = {
              user_id: userId,
              username: transaction.user?.username || `User${userId}`,
              avatar: transaction.user?.avatar || null,
              total_points: 0,
              giftcard_points: 0,
              crypto_points: 0,
              giftcard_transactions: 0,
              crypto_transactions: 0,
            };
          }

          userPoints[userId].total_points += points;
          userPoints[userId].crypto_points += points;
          userPoints[userId].crypto_transactions += 1;
        }
      });
    }

    return userPoints;
  }

  /**
   * Calculate points for giftcard transactions
   * @param {Object} transaction - Giftcard transaction
   * @returns {number} Points earned
   */
  calculateGiftcardPoints(transaction) {
    let basePoints = 0;

    // Base points based on transaction amount
    const amount = parseFloat(transaction.naira_equivalent) || 0;

    if (amount >= 100000) {
      basePoints = 1000; // High value transactions
    } else if (amount >= 50000) {
      basePoints = 500; // Medium value transactions
    } else if (amount >= 10000) {
      basePoints = 250; // Standard transactions
    } else {
      basePoints = 100; // Small transactions
    }

    // Bonus points for different card types
    const cardTypeBonus = {
      Amazon: 50,
      iTunes: 40,
      Steam: 60,
      'Google Play': 30,
      Apple: 45,
    };

    const bonus = cardTypeBonus[transaction.card_type] || 20;

    // Quantity multiplier
    const quantityMultiplier = Math.min(transaction.quantity || 1, 5);

    return Math.floor((basePoints + bonus) * quantityMultiplier);
  }

  /**
   * Calculate points for crypto transactions
   * @param {Object} transaction - Crypto transaction
   * @returns {number} Points earned
   */
  calculateCryptoPoints(transaction) {
    let basePoints = 0;

    // Base points based on transaction amount
    const amount = parseFloat(transaction.amount) || 0;

    if (amount >= 1000) {
      basePoints = 1500; // High value crypto transactions
    } else if (amount >= 500) {
      basePoints = 750; // Medium value transactions
    } else if (amount >= 100) {
      basePoints = 400; // Standard transactions
    } else {
      basePoints = 200; // Small transactions
    }

    // Bonus points for different crypto types
    const cryptoTypeBonus = {
      BTC: 100,
      USDT: 50,
      ETH: 80,
      BNB: 60,
    };

    const bonus = cryptoTypeBonus[transaction.currency] || 30;

    // Transaction type multiplier
    const typeMultiplier = transaction.type === 'buy' ? 1.2 : 1.0;

    return Math.floor((basePoints + bonus) * typeMultiplier);
  }

  /**
   * Generate leaderboard with rankings
   * @param {Object} userPoints - User points mapping
   * @returns {Array} Sorted leaderboard
   */
  generateLeaderboard(userPoints) {
    const users = Object.values(userPoints);

    // Sort by total points (descending)
    users.sort((a, b) => b.total_points - a.total_points);

    // Add rankings and colors
    return users.map((user, index) => ({
      ...user,
      rank: index + 1,
      color: this.getRankColor(index + 1),
      points: user.total_points,
    }));
  }

  /**
   * Get color for rank position
   * @param {number} rank - User rank
   * @returns {string} Color code
   */
  getRankColor(rank) {
    switch (rank) {
      case 1:
        return '#FFA500'; // Gold
      case 2:
        return '#4B39EF'; // Blue
      case 3:
        return '#EF4444'; // Red
      default:
        return '#9CA3AF'; // Gray
    }
  }

  /**
   * Get current user's leaderboard position based on their actual transaction data
   * @param {number} userId - Current user ID
   * @returns {Promise} User's leaderboard position
   */
  async getUserRank(userId) {
    try {
      // Get current user's transaction data
      const [giftcardResponse, cryptoResponse] = await Promise.all([
        this.getGiftcardHistories(),
        this.getCryptoHistories(),
      ]);

      // Calculate current user's points
      const userPoints = this.calculateUserPoints(
        giftcardResponse,
        cryptoResponse,
      );

      // Get the current user's data
      const currentUserData = userPoints[userId];

      if (!currentUserData) {
        return {
          success: true,
          data: null,
        };
      }

      // Generate mock leaderboard to estimate rank
      const mockLeaderboard = this.generateMockLeaderboard();

      // Find estimated rank based on points
      let estimatedRank = mockLeaderboard.length + 1;
      for (let i = 0; i < mockLeaderboard.length; i++) {
        if (currentUserData.total_points > mockLeaderboard[i].total_points) {
          estimatedRank = i + 1;
          break;
        }
      }

      // Add current user to the data
      const userRankData = {
        ...currentUserData,
        rank: estimatedRank,
        color: this.getRankColor(estimatedRank),
      };

      return {
        success: true,
        data: userRankData,
      };
    } catch (error) {
      console.error('Get user rank error:', error);
      throw error;
    }
  }

  /**
   * Get leaderboard statistics
   * @returns {Promise} Leaderboard statistics
   */
  async getLeaderboardStats() {
    try {
      const leaderboard = await this.getLeaderboard();
      const totalUsers = leaderboard.data.length;
      const totalPoints = leaderboard.data.reduce(
        (sum, user) => sum + user.total_points,
        0,
      );
      const avgPoints =
        totalUsers > 0 ? Math.floor(totalPoints / totalUsers) : 0;

      return {
        success: true,
        data: {
          total_users: totalUsers,
          total_points: totalPoints,
          average_points: avgPoints,
          top_user: leaderboard.data[0] || null,
        },
      };
    } catch (error) {
      console.error('Get leaderboard stats error:', error);
      throw error;
    }
  }

  /**
   * Format points for display
   * @param {number} points - Points to format
   * @returns {string} Formatted points
   */
  formatPoints(points) {
    if (points >= 1000000) {
      return `${(points / 1000000).toFixed(1)}M pts`;
    } else if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}K pts`;
    } else {
      return `${points} pts`;
    }
  }

  /**
   * Get rank badge text
   * @param {number} rank - User rank
   * @returns {string} Rank badge text
   */
  getRankBadge(rank) {
    switch (rank) {
      case 1:
        return '👑';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return rank.toString();
    }
  }

  /**
   * Get rank title
   * @param {number} rank - User rank
   * @returns {string} Rank title
   */
  getRankTitle(rank) {
    switch (rank) {
      case 1:
        return 'Champion';
      case 2:
        return 'Elite';
      case 3:
        return 'Expert';
      case 4:
      case 5:
        return 'Advanced';
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
        return 'Pro';
      default:
        return 'Member';
    }
  }

  /**
   * Calculate points breakdown for a user
   * @param {Object} user - User data
   * @returns {Object} Points breakdown
   */
  getPointsBreakdown(user) {
    return {
      total: user.total_points,
      giftcard: user.giftcard_points,
      crypto: user.crypto_points,
      giftcard_transactions: user.giftcard_transactions,
      crypto_transactions: user.crypto_transactions,
      total_transactions: user.giftcard_transactions + user.crypto_transactions,
    };
  }

  /**
   * Get leaderboard filters
   * @returns {Array} Available filters
   */
  getLeaderboardFilters() {
    return [
      {label: 'All Time', value: 'all'},
      {label: 'This Month', value: 'month'},
      {label: 'This Week', value: 'week'},
      {label: 'Giftcard Only', value: 'giftcard'},
      {label: 'Crypto Only', value: 'crypto'},
    ];
  }

  /**
   * Get achievement badges based on points
   * @param {number} points - User points
   * @returns {Array} Achievement badges
   */
  getAchievementBadges(points) {
    const badges = [];

    if (points >= 100000) {
      badges.push({name: 'Crypto Master', icon: '🚀', color: '#FFD700'});
    }
    if (points >= 50000) {
      badges.push({name: 'Giftcard Pro', icon: '🎁', color: '#4B39EF'});
    }
    if (points >= 25000) {
      badges.push({name: 'Trading Expert', icon: '💎', color: '#10B981'});
    }
    if (points >= 10000) {
      badges.push({name: 'Active Trader', icon: '⭐', color: '#F59E0B'});
    }
    if (points >= 5000) {
      badges.push({name: 'Rising Star', icon: '🌟', color: '#8B5CF6'});
    }

    return badges;
  }
}

export default new LeaderboardService();
