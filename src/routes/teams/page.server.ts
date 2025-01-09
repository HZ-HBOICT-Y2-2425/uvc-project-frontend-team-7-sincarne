

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const response = await fetch('/localhost:3000/user/groups');
    if (!response.ok) {
      throw new Error('Failed to fetch groups');
    }

    const groups = await response.json();
    return { groups };
  } catch (error) {
    return {
      groups: [],
      error: error.message || 'An error occurred while fetching groups',
    };
  }
};
