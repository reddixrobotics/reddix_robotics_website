/**
 * healthService — wraps the NestJS health check endpoint.
 * Useful to verify the API is reachable before rendering data-driven pages.
 */

import apiClient from './apiClient';

export interface HealthCheckResponse {
  status: string;
  info: Record<string, { status: string }>;
  error: Record<string, { status: string }>;
  details: Record<string, { status: string }>;
}

export async function checkApiHealth(): Promise<HealthCheckResponse> {
  const response = await apiClient.get<HealthCheckResponse>('/health');
  return response.data;
}
