import api from './api';

export const getVisitors = async (societyId) => {
  const { data } = await api.get(`/visitors/${societyId}`);
  return data;
};

export const createVisitor = async (visitorData) => {
  const { data } = await api.post('/visitors/add', visitorData);
  return data;
};

export const updateVisitorStatus = async (id, statusData) => {
  const { data } = await api.put(`/visitors/status/${id}`, statusData);
  return data;
};

export const markVisitorExit = async (id) => {
  const { data } = await api.put(`/visitors/exit/${id}`);
  return data;
};