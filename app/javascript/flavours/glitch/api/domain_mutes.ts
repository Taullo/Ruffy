import api, { getLinks } from 'flavours/glitch/api';

export const apiGetDomainMutes = async (url?: string) => {
  const response = await api().request<string[]>({
    method: 'GET',
    url: url ?? '/api/v1/domain_mutes',
  });

  return {
    domains: response.data,
    links: getLinks(response),
  };
};
