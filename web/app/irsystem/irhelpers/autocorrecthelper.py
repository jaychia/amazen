from app import rdb_01 as r
from string import ascii_lowercase
from autocorrect import spell

def autocorrect_word(word):
	pipe = r.pipeline()
	# inserting,deleting,adding one character
	word_candidates = list()
	for i in range(len(word)):
		word_candidates.append("".join([word[:i],word[i+1:]]))
		pipe.exists(word_candidates[-1])
		for c in ascii_lowercase:
			word_candidates.append("".join([word[:i],c,word[i:]]))
			pipe.exists(word_candidates[-1])
			word_candidates.append("".join([word[:i],c,word[i+1:]]))
			pipe.exists(word_candidates[-1])
	for i, val in enumerate(pipe.execute()):
		if val:
			return(word_candidates[i])

	# swapping two characters
	word_candidates = list()
	for i in range(len(word)-1):
		word_candidates.append("".join([word[:i],word[i+1],word[i],word[i+2:]]))
		pipe.exists(word_candidates[-1])

	for i, val in enumerate(pipe.execute()):
		if val:
			return(word_candidates[i])

	# adding two characters to the end
	x1 = time.time()
	word_candidates = list()
	for c_1 in ascii_lowercase:
		for c_2 in ascii_lowercase:
			word_candidates.append("".join([word,c_1,c_2]))
			pipe.exists(word_candidates[-1])
			word_candidates.append("".join([word[:-1],c_1,c_2]))
			pipe.exists(word_candidates[-1])
			word_candidates.append("".join([word[:-2],c_1,c_2]))
			pipe.exists(word_candidates[-1])
	for i, val in enumerate(pipe.execute()):
		if val:
			return(word_candidates[i])

	return spell(word)

def autocorrect_query(query):
	return [autocorrect_word(word.strip().lower()) for word in query.split(" ")]