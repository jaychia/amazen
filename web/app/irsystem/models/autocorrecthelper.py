from app import rdb_01 as r
from string import ascii_lowercase
from autocorrect import spell

def get_highest_ranking_term(wordlist):
	pipe = r.pipeline()
	for word in wordlist:
		pipe.get(word)
	cooclengths = [len(cooclist) for cooclist in pipe.execute()]
	return wordlist[cooclengths.index(max(cooclengths))]

def autocorrect_word(word):
	pipe = r.pipeline()
	# inserting,deleting,adding one character
	word_candidates = list()
	valid_words = list()

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
			valid_words.append(word_candidates[i])
	# swapping two characters
	word_candidates = list()
	for i in range(len(word)-1):
		word_candidates.append("".join([word[:i],word[i+1],word[i],word[i+2:]]))
		pipe.exists(word_candidates[-1])

	for i, val in enumerate(pipe.execute()):
		if val:
			valid_words.append(word_candidates[i])

	# adding two characters to the end
	word_candidates = list()
	for c_1 in ascii_lowercase:
		for c_2 in ascii_lowercase:
			word_candidates.append("".join([word,c_1,c_2]))
			pipe.exists(word_candidates[-1])
			for word_indx in range(1,len(word)/2):
				word_candidates.append("".join([word[:-word_indx],c_1,c_2]))
				pipe.exists(word_candidates[-1])
	for i, val in enumerate(pipe.execute()):
		if val:
			valid_words.append(word_candidates[i])

	if len(valid_words) > 0:
		return get_highest_ranking_term(valid_words)

	spellchecked_word = spell(word)
	# return word only if it is in the product dictionary
	if r.exists(spellchecked_word):
		return spellchecked_word
	else:
		return ''

def autocorrect_query(query):
	autocorrected_word_list = [autocorrect_word(word.strip().lower()) for word in query.split(" ")]
	autocorrected_word_list_filtered = list()
	for word in autocorrected_word_list:
		if len(word) > 2:
			autocorrected_word_list_filtered.append(word)
	return autocorrected_word_list_filtered
