from flask import Flask, request, jsonify, render_template_string
from pipeline import RAGPipeline
from data_processing import preprocess_corpus, load_corpus

# Initialize Flask app
app = Flask(__name__)

# Load the preprocessed corpus (this can be done once when the app starts)
corpus_filepath = 'corpus.json'  # Path to corpus
corpus = load_corpus(corpus_filepath)
preprocessed_corpus = preprocess_corpus(corpus)

# Initialize the RAG pipeline with the corpus
pipeline = RAGPipeline(preprocessed_corpus)

# HTML Template with form for input and displaying output
html_template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RAG System</title>
</head>
<body>
    <h1>RAG System</h1>
    <form method="POST" action="/answer">
        <label for="query">Enter your query:</label><br>
        <input type="text" id="query" name="query" required><br><br>
        <input type="submit" value="Submit">
    </form>

    {% if query %}
        <h2>Query: {{ query }}</h2>
        <h3>Answer: {{ answer }}</h3>
        <h3>Evidence:</h3>
        <ul>
            {% for ev in evidence %}
                <li><strong>Title:</strong> {{ ev['title'] }} <br>
                    <strong>Author:</strong> {{ ev['author'] }} <br>
                    <strong>Source:</strong> {{ ev['source'] }} <br>
                    <strong>Fact:</strong> {{ ev['fact'] }}<br>
                    <strong>URL:</strong> <a href="{{ ev['url'] }}" target="_blank">{{ ev['url'] }}</a>
                </li><br>
            {% endfor %}
        </ul>
    {% endif %}
</body>
</html>
"""

@app.route('/', methods=['GET'])
def home():
    return render_template_string(html_template)

@app.route('/answer', methods=['POST'])
def answer_query():
    """Handle incoming queries and return generated answers."""
    query = request.form.get('query', '')

    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    # Run the RAG pipeline to get the answer and evidence
    output = pipeline.answer_query(query)
    answer = output.get("answer", "No answer found.")
    evidence = output.get("evidence_list", [])

    # Render the HTML template with the query, answer, and evidence
    return render_template_string(html_template, query=query, answer=answer, evidence=evidence)

if __name__ == '__main__':
    app.run(debug=True)