//Fetch the questions from the API based on the selected category and difficulty
export const fetchQuestions = async (category, difficulty) => {
  try {
    const url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.response_code === 0) {
      return data.results; 
    } else {
      throw new Error("Failed to fetch questions from API");
    }
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};
//Fetch a list of all the available categories from the API
export const fetchCategories = async () => {
  try {
    const response = await fetch('https://opentdb.com/api_category.php');
    const data = await response.json();
    return data.trivia_categories; 
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};