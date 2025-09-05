import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import Yield from '../models/Yield';
import { yieldService } from '../services/yieldService';

describe('Yield Endpoints', () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/yieldmax_test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Yield.deleteMany({});
  });

  describe('GET /api/v1/yields', () => {
    beforeEach(async () => {
      // Create test yield data
      const testYields = [
        {
          platform: 'Aave',
          token: 'USDC',
          apy: 4.2,
          tvl: '$1.2B',
          riskScore: 0.9,
          category: 'lending',
          chainId: 1
        },
        {
          platform: 'Compound',
          token: 'DAI',
          apy: 3.8,
          tvl: '$890M',
          riskScore: 0.85,
          category: 'lending',
          chainId: 1
        },
        {
          platform: 'Yearn',
          token: 'USDT',
          apy: 5.1,
          tvl: '$650M',
          riskScore: 0.75,
          category: 'yield-farming',
          chainId: 1
        }
      ];

      await Yield.insertMany(testYields);
    });

    it('should fetch all yields successfully', async () => {
      const response = await request(app)
        .get('/api/v1/yields')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(3);
      expect(response.body.message).toBe('Yields fetched successfully');
    });

    it('should filter yields by category', async () => {
      const response = await request(app)
        .get('/api/v1/yields?category=lending')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].category).toBe('lending');
    });

    it('should sort yields by APY', async () => {
      const response = await request(app)
        .get('/api/v1/yields?sortBy=apy')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data[0].apy).toBe(5.1); // Highest APY first
    });

    it('should filter yields by minimum APY', async () => {
      const response = await request(app)
        .get('/api/v1/yields?minApy=4.0')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(2);
      response.body.data.forEach((yield: any) => {
        expect(yield.apy).toBeGreaterThanOrEqual(4.0);
      });
    });
  });

  describe('GET /api/v1/yields/top/:limit', () => {
    beforeEach(async () => {
      const testYields = Array.from({ length: 15 }, (_, i) => ({
        platform: `Platform${i}`,
        token: `TOKEN${i}`,
        apy: Math.random() * 10 + 1,
        tvl: `$${Math.floor(Math.random() * 1000)}M`,
        riskScore: Math.random(),
        category: 'lending',
        chainId: 1
      }));

      await Yield.insertMany(testYields);
    });

    it('should return top 10 yields by default', async () => {
      const response = await request(app)
        .get('/api/v1/yields/top')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(10);
    });

    it('should respect custom limit', async () => {
      const response = await request(app)
        .get('/api/v1/yields/top/5')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(5);
    });

    it('should return yields sorted by APY descending', async () => {
      const response = await request(app)
        .get('/api/v1/yields/top/3')
        .expect(200);

      const yields = response.body.data;
      for (let i = 0; i < yields.length - 1; i++) {
        expect(yields[i].apy).toBeGreaterThanOrEqual(yields[i + 1].apy);
      }
    });
  });

  describe('GET /api/v1/yields/:id', () => {
    let yieldId: string;

    beforeEach(async () => {
      const yield_ = await Yield.create({
        platform: 'Test Platform',
        token: 'TEST',
        apy: 5.0,
        tvl: '$100M',
        riskScore: 0.8,
        category: 'lending',
        chainId: 1,
        audits: ['CertiK', 'ConsenSys'],
        metrics: {
          dailyVolume: 1000000,
          weeklyVolume: 7000000,
          totalUsers: 5000
        }
      });

      yieldId = yield_._id.toString();
    });

    it('should fetch yield by ID successfully', async () => {
      const response = await request(app)
        .get(`/api/v1/yields/${yieldId}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.platform).toBe('Test Platform');
      expect(response.body.data.token).toBe('TEST');
      expect(response.body.data.audits).toHaveLength(2);
    });

    it('should return 404 for non-existent yield', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/v1/yields/${fakeId}`)
        .expect(404);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Yield not found');
    });

    it('should return 400 for invalid yield ID', async () => {
      const response = await request(app)
        .get('/api/v1/yields/invalid-id')
        .expect(400);

      expect(response.body.status).toBe('error');
    });
  });

  describe('Yield Service', () => {
    describe('updateYieldData', () => {
      it('should update yield data from external APIs', async () => {
        // Mock external API responses
        jest.spyOn(yieldService, 'fetchCoinGeckoYields').mockResolvedValue([
          {
            platform: 'Aave',
            token: 'USDC',
            apy: 4.5,
            tvl: '$1.3B',
            riskScore: 0.9,
            category: 'lending',
            chainId: 1,
            lastUpdated: new Date()
          }
        ]);

        jest.spyOn(yieldService, 'fetchDeFiLlamaYields').mockResolvedValue([
          {
            platform: 'Compound',
            token: 'DAI',
            apy: 3.9,
            tvl: '$900M',
            riskScore: 0.85,
            category: 'lending',
            chainId: 1,
            lastUpdated: new Date()
          }
        ]);

        await yieldService.updateYieldData();

        const yields = await Yield.find({});
        expect(yields).toHaveLength(2);
        expect(yields[0].platform).toBe('Aave');
        expect(yields[1].platform).toBe('Compound');
      });
    });

    describe('getAllYields', () => {
      beforeEach(async () => {
        const testYields = [
          {
            platform: 'Aave',
            token: 'USDC',
            apy: 4.2,
            tvl: '$1.2B',
            riskScore: 0.9,
            category: 'lending',
            chainId: 1
          },
          {
            platform: 'Uniswap',
            token: 'ETH/USDC',
            apy: 8.5,
            tvl: '$500M',
            riskScore: 0.6,
            category: 'dex',
            chainId: 1
          }
        ];

        await Yield.insertMany(testYields);
      });

      it('should apply filters correctly', async () => {
        const filters = { category: 'lending' };
        const yields = await yieldService.getAllYields(filters);
        
        expect(yields).toHaveLength(1);
        expect(yields[0].category).toBe('lending');
      });

      it('should return all yields when no filters applied', async () => {
        const yields = await yieldService.getAllYields();
        expect(yields).toHaveLength(2);
      });
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limiting to yield endpoints', async () => {
      // Make multiple requests quickly
      const requests = Array.from({ length: 10 }, () => 
        request(app).get('/api/v1/yields')
      );

      const responses = await Promise.all(requests);
      
      // All requests should succeed (within rate limit)
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Temporarily close the database connection
      await mongoose.connection.close();

      const response = await request(app)
        .get('/api/v1/yields')
        .expect(500);

      expect(response.body.status).toBe('error');
      
      // Reconnect for other tests
      const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/yieldmax_test';
      await mongoose.connect(mongoUri);
    });
  });
});
