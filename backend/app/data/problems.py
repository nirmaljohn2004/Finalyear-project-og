PROBLEMS_DATA = {
    "201": {
        "id": 201,
        "title": "Two Sum",
        "difficulty": "Easy",
        "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.",
        "examples": [
            "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
            "Input: nums = [3,2,4], target = 6\nOutput: [1,2]"
        ],
        "test_cases": [
            {"input": "nums = [2,7,11,15], target = 9", "expected": "[0, 1]"},
            {"input": "nums = [3,2,4], target = 6", "expected": "[1, 2]"},
            {"input": "nums = [3,3], target = 6", "expected": "[0, 1]"}
        ],
        "starter_code": {
            "python": "from typing import List\n\nclass Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your code here\n        pass\n\n# Driver Code\nif __name__ == '__main__':\n    sol = Solution()\n    print(sol.twoSum([2, 7, 11, 15], 9))",
            "java": "import java.util.Arrays;\n\npublic class Main {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        int[] result = sol.twoSum(new int[]{2, 7, 11, 15}, 9);\n        System.out.println(Arrays.toString(result));\n    }\n}\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}"
        }
    },
    "202": {
        "id": 202,
        "title": "Longest Substring Without Repeating Characters",
        "difficulty": "Medium",
        "description": "Given a string `s`, find the length of the **longest substring** without repeating characters.",
        "examples": [
            "Input: s = \"abcabcbb\"\nOutput: 3\nExplanation: The answer is \"abc\", with the length of 3.",
            "Input: s = \"bbbbb\"\nOutput: 1\n"
        ],
        "test_cases": [
             {"input": "s = \"abcabcbb\"", "expected": "3"},
             {"input": "s = \"bbbbb\"", "expected": "1"},
             {"input": "s = \"pwwkew\"", "expected": "3"},
             {"input": "s = \"\"", "expected": "0"}
        ],
        "starter_code": {
            "python": "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass\n\n# Driver Code\nif __name__ == '__main__':\n    sol = Solution()\n    print(sol.lengthOfLongestSubstring('abcabcbb'))",
             "java": "public class Main {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.lengthOfLongestSubstring(\"abcabcbb\"));\n    }\n}\n\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}"
        }
    }
}
