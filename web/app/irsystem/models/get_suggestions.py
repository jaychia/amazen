import redis 
import ast 
from collections import Counter

r = redis.StrictRedis(host='localhost', port=6379, db=1)
N = 5

def get_suggestions(query):
	split_query = query.split(" ")
	all_suggestions = Counter()
	for term in split_query:
		term_suggestions = ast.literal_eval(r.get(term))
		all_suggestions+= Counter(dict(term_suggestions))

	return all_suggestions.most_common(N)