import openai

# Set your OpenAI API key
api_key = "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"

# Define the assistant ID (check OpenAI API docs for this)
assistant_id = "asst_GoUA2iVIVKi2xUCEvf9Lrjko"

# Function to query the agent
def query_virtual_weiter(question):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4-turbo",
            messages=[{"role": "system", "content": "You are Virtual Weiter, an expert assistant."},
                      {"role": "user", "content": question}],
            api_key=api_key
        )
        return response["choices"][0]["message"]["content"]
    except Exception as e:
        return f"Error: {e}"

# Example query
question = "What is the capital of France?"
answer = query_virtual_weiter(question)
print(f"Q: {question}\nA: {answer}")

