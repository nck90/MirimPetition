import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PetitionService } from '../petitions/petition.service';
import { VoteService } from '../votes/vote.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Petition } from '../entities/petition.entity';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class AiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly petitionService: PetitionService,
    private readonly voteService: VoteService,
    private readonly cacheService: CacheService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async analyzePetition(petitionId: string) {
    const cacheKey = `petition_analysis_${petitionId}`;
    const cachedAnalysis = await this.cacheService.get(cacheKey);
    if (cachedAnalysis) {
      return cachedAnalysis;
    }

    const petition = await this.petitionService.findOne(petitionId);
    if (!petition) {
      throw new NotFoundException('Petition not found');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = this.generateAnalysisPrompt(petition);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const analysis = response.text();

      const analysisResult = {
        analysis,
        timestamp: new Date().toISOString(),
      };

      await this.cacheService.set(cacheKey, analysisResult, 3600); // Cache for 1 hour
      return analysisResult;
    } catch (error) {
      this.logger.error(`Error analyzing petition ${petitionId}:`, error);
      throw new Error('Failed to analyze petition');
    }
  }

  async getRecommendations(userId: string) {
    const cacheKey = `user_recommendations_${userId}`;
    const cachedRecommendations = await this.cacheService.get(cacheKey);
    if (cachedRecommendations) {
      return cachedRecommendations;
    }

    const userVotes = await this.voteService.findByUserId(userId);
    const votedPetitions = await Promise.all(
      userVotes.map(vote => this.petitionService.findOne(vote.petition.id)),
    );

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = this.generateRecommendationsPrompt(votedPetitions);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const recommendations = response.text();

      const recommendationsResult = {
        recommendations,
        userVotes,
        timestamp: new Date().toISOString(),
      };

      await this.cacheService.set(cacheKey, recommendationsResult, 1800); // Cache for 30 minutes
      return recommendationsResult;
    } catch (error) {
      this.logger.error(`Error getting recommendations for user ${userId}:`, error);
      throw new Error('Failed to generate recommendations');
    }
  }

  async categorizePetition(petitionId: string) {
    const cacheKey = `petition_category_${petitionId}`;
    const cachedCategory = await this.cacheService.get(cacheKey);
    if (cachedCategory) {
      return cachedCategory;
    }

    const petition = await this.petitionService.findOne(petitionId);
    if (!petition) {
      throw new NotFoundException('Petition not found');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = this.generateCategorizationPrompt(petition);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const category = response.text();

      const categoryResult = {
        suggestedCategory: category,
        timestamp: new Date().toISOString(),
      };

      await this.cacheService.set(cacheKey, categoryResult, 3600); // Cache for 1 hour
      return categoryResult;
    } catch (error) {
      this.logger.error(`Error categorizing petition ${petitionId}:`, error);
      throw new Error('Failed to categorize petition');
    }
  }

  async summarizePetition(petitionId: string) {
    const cacheKey = `petition_summary_${petitionId}`;
    const cachedSummary = await this.cacheService.get(cacheKey);
    if (cachedSummary) {
      return cachedSummary;
    }

    const petition = await this.petitionService.findOne(petitionId);
    if (!petition) {
      throw new NotFoundException('Petition not found');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = this.generateSummaryPrompt(petition);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const summary = response.text();

      const summaryResult = {
        summary,
        timestamp: new Date().toISOString(),
      };

      await this.cacheService.set(cacheKey, summaryResult, 3600); // Cache for 1 hour
      return summaryResult;
    } catch (error) {
      this.logger.error(`Error summarizing petition ${petitionId}:`, error);
      throw new Error('Failed to summarize petition');
    }
  }

  private generateAnalysisPrompt(petition: Petition): string {
    return `청원 분석 전문가로서, 주어진 청원의 내용을 분석하고 실현 가능성, 영향력, 시급성을 평가해주세요.
    
청원 제목: ${petition.title}
청원 내용: ${petition.content}
카테고리: ${petition.category}
상태: ${petition.status}
투표 수: ${petition.voteCount}

다음 항목들을 포함하여 분석해주세요:
1. 청원의 주요 목적
2. 실현 가능성 평가
3. 예상되는 영향력
4. 시급성 평가
5. 개선 제안`;
  }

  private generateRecommendationsPrompt(petitions: Petition[]): string {
    return `사용자의 투표 기록을 바탕으로 관심사를 분석하고 관련된 청원을 추천해주세요.

사용자가 투표한 청원 목록:
${petitions
  .map(
    petition =>
      `- ${petition.title} (카테고리: ${petition.category}, 상태: ${petition.status})`,
  )
  .join('\n')}

다음 항목들을 포함하여 추천해주세요:
1. 사용자의 관심사 분석
2. 추천 청원 목록 (최소 3개)
3. 추천 이유
4. 예상되는 참여도`;
  }

  private generateCategorizationPrompt(petition: Petition): string {
    return `청원의 내용을 분석하여 가장 적합한 카테고리를 추천해주세요.
카테고리는 ACADEMIC, FACILITY, WELFARE, EVENT, OTHER 중에서 선택해야 합니다.

청원 제목: ${petition.title}
청원 내용: ${petition.content}

다음 항목들을 포함하여 분석해주세요:
1. 현재 카테고리
2. 추천 카테고리
3. 카테고리 변경 이유`;
  }

  private generateSummaryPrompt(petition: Petition): string {
    return `청원의 내용을 간단하고 명확하게 요약해주세요.

청원 제목: ${petition.title}
청원 내용: ${petition.content}

다음 항목들을 포함하여 요약해주세요:
1. 핵심 요청사항
2. 주요 근거
3. 예상되는 효과
4. 시급성`;
  }
} 