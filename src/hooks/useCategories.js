import { useApi } from './useApi';
import { categoryService } from '../services/categoryService';

export const useCategories = () => {
  return useApi(() => categoryService.getCategories());
};

export const useMainCategories = () => {
  return useApi(() => categoryService.getMainCategories());
};

export const useSubCategories = (parentId) => {
  return useApi(() => categoryService.getSubCategories(parentId), [parentId]);
};

export default useCategories;