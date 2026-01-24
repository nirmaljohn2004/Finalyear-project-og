import axios from './axios';

export const generateLearningPath = async (language, level, quizResults, availableTopics) => {
    try {
        const response = await axios.post('/learning/generate_path', {
            language,
            level,
            quizResults,
            availableTopics
        });
        return response.data;
    } catch (error) {
        console.error('Error generating learning path:', error);
        throw error;
    }
};

export const getLearningPath = async (language, level) => {
    try {
        const response = await axios.get(`/learning/path/${language}`, {
            params: { level }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching learning path:', error);
        throw error;
    }
};

export const getTopicContent = async (language, topicId) => {
    try {
        const response = await axios.get(`/learning/topic/${language}/${topicId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching topic content:', error);
        throw error;
    }
};

export const resetLearningPath = async (language, level) => {
    try {
        await axios.delete(`/learning/path/${language}`, {
            params: { level }
        });
    } catch (error) {
        console.error('Error resetting learning path:', error);
        throw error;
    }
};

export const submitTopicQuiz = async (language, topicId, submission, totalQuestions) => {
    try {
        const response = await axios.post(`/learning/topic/${language}/${topicId}/submit`, {
            submission,
            totalQuestions
        });
        return response.data;
    } catch (error) {
        console.error('Error submitting topic quiz:', error);
        throw error;
    }
};
