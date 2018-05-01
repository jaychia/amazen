from app import rdb_01
import ast 
from collections import Counter
from autocorrecthelper import autocorrect_query

N = 10

def get_suggestions(query):
	split_query = query.split(" ")
	all_suggestions = Counter()
	pipe = rdb_01.pipeline()
	for term in split_query:
		pipe.exists(term)
	# all terms are in product dictionary
	if False not in pipe.execute():
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
	autocorrected_suggestion = " ".join(autocorrect_query(query))
	return [] if len(autocorrected_suggestion) == 0 else [autocorrected_suggestion], 1