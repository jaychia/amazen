import re
from nltk.corpus import stopwords
from collections import defaultdict
import json
import pickle
import os

# string to token set
def to_tokens_set(w):
    stop_words = set(stopwords.words('english'))
    word_splitter = re.compile(r"""
    (\w+)
    """, re.VERBOSE)
    return set([w.lower() for w in word_splitter.findall(str(w)) if w.lower() not in stop_words])

# used for step 2 and 3. for step 2 the input is a list with one element (title + description)
def to_lists_of_tokens(doc_lst):
    """ From list of documents, returns a list of set of tokens (where the set of tokens is the tokens in each doc)
    """
    lsts_of_tokens = []
    for each_doc in doc_lst:
        lsts_of_tokens.append(to_tokens_set(each_doc))
    return lsts_of_tokens

def update_inverted_indices(in_inverted_indices, pid, categories, doc_lst, in_to_lists_of_tokens):
    """ Updates the in_inverted_indices with documents for each product (should be called once for every product)
    """
    doc_tokens_list = in_to_lists_of_tokens(doc_lst)
    product_token_set = set.union(*map(set, doc_tokens_list))
    total_doc_num = len(doc_tokens_list)
    
    for token in product_token_set:
        doc_frequency = 0
        
        for doc_tokens in doc_tokens_list:
            if token in doc_tokens:
                doc_frequency += 1
        
        doc_frequency /= total_doc_num
        
        for cat in categories:
            in_inverted_indices[cat][token].append((pid, doc_frequency))

# helper function to concat title and description (products may be missing fields)
def product_info_to_string(prod_info):
    # all products have title field
    product_info_str = prod_info['title']
    
    if 'description'in prod_info:
        product_info_str = " ".join([product_info_str, product_info_str])
    return product_info_str
        
def load_inverted_indices_list(categories):
    inverted_index_list_2 =  list()
    inverted_index_list_3 = list()
    
    for cat in categories:
        pickle_name = '{}{}{}'.format("inverted_indices/step2/", cat, "2.pickle")
        with open(pickle_name, 'rb') as handle:
            inverted_index_list_2.append(pickle.load(handle)) 

        pickle_name = '{}{}{}'.format("inverted_indices/step3/", cat, "3.pickle")
        with open(pickle_name, 'rb') as handle:
            inverted_index_list_3.append(pickle.load(handle)) 

    return inverted_index_list_2, inverted_index_list_3

# can be used for step 2 and 3
def top_k_pids_step2(query_list, in_inverted_index_list, k):
    product_simscores = defaultdict(float)
    
    # binary 
    query_token_set = to_tokens_set(" ".join(query_list))

    for token in query_token_set:
        for i, in_inverted_index in enumerate(in_inverted_index_list):
            # token from the query must be in the inverted_index
            if token in in_inverted_index:
                for (pid,score) in in_inverted_index[token]:
                    product_simscores[(pid,i)] += score
    
    top_pid_simscore_tuple_list = Counter(product_scores).most_common()
    
    top_k_pid_list = list()
    
    for ((pid,i), score) in top_pid_simscore_tuple_list:
        if pid not in top_k_pid_list:
            top_k_pid_list.append(pid)
            
            if len(top_k_pid_list) == k:
                break
    
    return top_k_pid_list

def top_k_pids_step3(query_list, top_pids, in_inverted_index_list, k):
    product_simscores = defaultdict(float)
    
    # binary 
    query_token_set = to_tokens_set(" ".join(query_list))

    for token in query_token_set:
        for i, in_inverted_index in enumerate(in_inverted_index_list):
            # token from the query must be in the inverted_index
            if token in in_inverted_index:
                for (pid,score) in in_inverted_index[token]:
            		if pid in top_pids:
                		product_simscores[(pid,i)] += score
    
    top_pid_simscore_tuple_list = Counter(product_scores).most_common()
    
    top_k_pid_list = list()
    
    for ((pid,i), score) in top_pid_simscore_tuple_list:
        if pid not in top_k_pid_list:
            top_k_pid_list.append(pid)
            
            if len(top_k_pid_list) == k:
                break
    
    return top_k_pid_list

# q is a search name, descs are list of input descriptors, cats are relevant categories
def top_k_pids(q, descs, cats, k2=100, k3=10):

	#step2 
	step2_query_lst = [q]
	inverted_index_list_2, inverted_index_list_3 = load_inverted_indices_list(cats)

	top_pids_step2 = top_k_pids_step2(step2_query_lst, inverted_index_list_2, k2) 

	step3_query_lst = descs.append(q)

	return top_k_pids_step3(step3_query_lst, top_pids_step2, inverted_index_list_3, k3)
















