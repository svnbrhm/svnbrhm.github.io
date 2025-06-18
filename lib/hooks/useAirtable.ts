import { useState, useEffect } from 'react';
import { Crew } from '../../types/crew';

// Custom hook for fetching crews
export function useCrews() {
  const [crews, setCrews] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCrews();
  }, []);

  const fetchCrews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/crews');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch crews');
      }
      
      setCrews(data.crews || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching crews:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchCrews();
  };

  return { crews, loading, error, refetch };
}

// Custom hook for fetching a single crew
export function useCrew(crewId: string | undefined) {
  const [crew, setCrew] = useState<Crew | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (crewId) {
      fetchCrew(crewId);
    } else {
      setLoading(false);
    }
  }, [crewId]);

  const fetchCrew = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/crews/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch crew');
      }
      
      setCrew(data.crew || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching crew:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    if (crewId) {
      fetchCrew(crewId);
    }
  };

  return { crew, loading, error, refetch };
}

// Custom hook for searching crews
export function useCrewSearch() {
  const [crews, setCrews] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCrews = async (searchTerm: string, city?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (city) params.append('city', city);
      
      const response = await fetch(`/api/crews?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to search crews');
      }
      
      setCrews(data.crews || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error searching crews:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setCrews([]);
    setError(null);
  };

  return { crews, loading, error, searchCrews, clearSearch };
}

// Custom hook for testing Airtable connection
export function useAirtableTest() {
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    config?: { hasApiKey: boolean; hasBaseId: boolean };
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/test-airtable');
      const data = await response.json();
      
      setResult(data);
      
      if (!response.ok) {
        setError(data.error || 'Test failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error testing Airtable connection:', err);
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, testConnection };
}