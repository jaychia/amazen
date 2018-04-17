import re
from nltk.tokenize import RegexpTokenizer
from collections import defaultdict
from collections import Counter
import json
import pickle
import numpy as np
import os
from nltk.stem.snowball import SnowballStemmer
import pickle

# string to token set
def to_tokens_set(in_str):
    with open('/vol/app/irsystem/irhelpers/data/stopwords.pickle', 'rb') as handle:
        stop_words = set(pickle.load(handle))
    # stop_words = set(stopwords.words('english'))
    tokenizer = RegexpTokenizer('\w+')
    tokenized_set = set([word for word in tokenizer.tokenize(in_str.lower()) if word not in stop_words])
    stemmer = SnowballStemmer("english")
    return set([stemmer.stem(token) for token in tokenized_set])

def to_q_desc(q,descs):
    if len(descs) == 0:
        return q
    else:
        return " ".join(descs + [q])

# can be used for step 2 and 3
def top_k_pids_step2(inverted_index_product, k2):
    product_simscores = defaultdict(float)
    
    for term, scorelist in inverted_index_product.items():
        for (asin, score) in scorelist:
            product_simscores[asin] += score
    
    product_simscores_keys = list(product_simscores.keys())
    product_simscores_np = np.array([product_simscores[i] for i in product_simscores_keys])

    product_simscores_keys_indices_ordered = np.argsort(product_simscores_np)[::-1]
        
    top_k_pid_list = [product_simscores_keys[key_index] for key_index in product_simscores_keys_indices_ordered]

    return top_k_pid_list if len(top_k_pid_list)<=k2 else top_k_pid_list[:k2]

def top_k_pids_step3(top_pids, inverted_index_review, k3):
    product_simscores = defaultdict(float)
    
    for term, scorelist in inverted_index_review.items():
        for (asin, score) in scorelist:
            if asin in top_pids:
                product_simscores[asin] += score
    
    product_simscores_keys = list(product_simscores.keys())
    product_simscores_np = np.array([product_simscores[i] for i in product_simscores_keys])
    
    product_simscores_keys_indices_ordered = np.argsort(product_simscores_np)[::-1]
            
    top_k_pid_list = [product_simscores_keys[key_index] for key_index in product_simscores_keys_indices_ordered]
    
    return top_k_pid_list if len(top_k_pid_list)<=k3 else top_k_pid_list[:k3]

# q is a search name, descs are list of input descriptors, cats are relevant categories
def get_top_k_pids(inverted_index_product, inverted_index_review, k2=100, k3=10):

    top_pids_step2 = top_k_pids_step2(inverted_index_product, k2)

    return top_k_pids_step3(top_pids_step2, inverted_index_review, k3)
