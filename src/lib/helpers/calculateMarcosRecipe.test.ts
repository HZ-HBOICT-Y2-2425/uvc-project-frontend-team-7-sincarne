import { calculateMarcosForARecipe } from './caclucateMarcosRecipe';
import axios from 'axios';

jest.mock('axios'); // Mock the axios module

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('calculateMarcosForARecipe', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should calculate macros correctly for valid ingredients', async () => {
    const mockIngredients = [
      { name: 'Chicken', amount: 100, emission: 0 },
      { name: 'Rice', amount: 100, emission: 0  },
    ];

    const mockResponse = {
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url: '/nutri/getNutritions/ByName/Chicken', method: 'get' },
      data: [
        { name: 'Energy', nutrient_value: 165, unit_name:'Kcal' },
        { name: 'Protein', nutrient_value: 31 , unit_name:'g'},
        { name: 'Carbohydrate, by difference', nutrient_value: 0, unit_name:'g' },
        { name: 'Total lipid (fat)', nutrient_value: 3.6, unit_name:'g' },
      ],
    };

    // Mock axios responses for each ingredient
    mockedAxios.get.mockResolvedValueOnce(mockResponse);
    mockedAxios.get.mockResolvedValueOnce({
      ...mockResponse,
      config: { url: '/nutri/getNutritions/ByName/Rice', method: 'get' },
    });

    const result = await calculateMarcosForARecipe(mockIngredients);

    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    expect(mockedAxios.get).toHaveBeenCalledWith('/nutri/getNutritions/ByName/Chicken');
    expect(mockedAxios.get).toHaveBeenCalledWith('/nutri/getNutritions/ByName/Rice');

    expect(result).toEqual({
      total_calories: 165 * 2,
      total_protein: 31 * 2,
      total_carbs: 0 * 2,
      total_fats: 3.6 * 2,
    });
  });

  it('should handle an empty list of ingredients', async () => {
    const result = await calculateMarcosForARecipe([]);

    expect(mockedAxios.get).not.toHaveBeenCalled(); // No API calls should be made
    expect(result).toEqual({
      total_calories: 0,
      total_protein: 0,
      total_carbs: 0,
      total_fats: 0,
    });
  });

  it('should handle invalid API responses', async () => {
    const mockIngredients = [{ name: 'InvalidIngredient', amount: 100, emission: 0 }];

    const mockInvalidResponse = {
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url: '/nutri/getNutritions/ByName/InvalidIngredient', method: 'get' },
      data: { invalid: 'data' }, // Invalid structure
    };

    mockedAxios.get.mockResolvedValueOnce(mockInvalidResponse);

    const result = await calculateMarcosForARecipe(mockIngredients);

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      total_calories: 0,
      total_protein: 0,
      total_carbs: 0,
      total_fats: 0,
    });
  });

  it('should handle partial data from the API', async () => {
    const mockIngredients = [{ name: 'PartialDataIngredient', amount: 50, emission: 0 }];
    const mockPartialResponse = {
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url: '/nutri/getNutritions/ByName/PartialDataIngredient', method: 'get' },
      data: [
        { name: 'Energy', nutrient_value: 100, unit_name: "" },
        // Missing "Protein" and "Carbohydrate, by difference"
        { name: 'Total lipid (fat)', nutrient_value: 5, unit_name:""},
      ],
    };

    mockedAxios.get.mockResolvedValueOnce(mockPartialResponse);

    const result = await calculateMarcosForARecipe(mockIngredients);

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      total_calories: 50, // 100 * (50 / 100)
      total_protein: 0, // Missing Protein
      total_carbs: 0, // Missing Carbs
      total_fats: 2.5, // 5 * (50 / 100)
    });
  });
});

