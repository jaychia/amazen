from app import rdb_01
import ast 
from collections import Counter
from autocorrecthelper import autocorrect_query

N = 10

def get_suggestions(query):
	split_query = query.split(" ")
	all_suggestions = Counter()
	for term in split_query:
		try:
			term_suggestions = ast.literal_eval(rdb_01.get(term))
		except:
			break
		all_suggestions+= Counter(dict(term_suggestions))
	suggestion_word_list =  map(lambda x: x[0], all_suggestions.most_common(N))
	if len(suggestion_word_list) > 0:
		# should not replace = 0
		return suggestion_word_list, 0

	# if no recommended words then return recommendations
	# should replace = 1
	return [" ".join(autocorrect_query(query))], 1