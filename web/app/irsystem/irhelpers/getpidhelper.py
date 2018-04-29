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
from flask import current_app

# string to token set
def to_tokens_set(in_str):
    regex_for_stopwords = r"\breally \b|\ball \b|\bjust \b|\bdon\'t \b|\bbeing \b|\bover \b|\bboth \b|\bthrough \b|\byourselves \b|\bits \b|\bbefore \b|\bo \b|\bdon \b|\bhadn \b|\bherself \b|\bll \b|\bhad \b|\bshould \b|\bto \b|\bonly \b|\bwon \b|\bunder \b|\bours \b|\bhas \b|\bshould\'ve \b|\bhaven\'t \b|\bdo \b|\bthem \b|\bhis \b|\bvery \b|\byou\'ve \b|\bthey \b|\bduring \b|\bnow \b|\bhim \b|\bnor \b|\bwasn\'t \b|\bd \b|\bdid \b|\bdidn \b|\bthis \b|\bshe \b|\beach \b|\bfurther \b|\bwon\'t \b|\bwhere \b|\bmustn\'t \b|\bisn\'t \b|\bfew \b|\bbecause \b|\byou\'d \b|\bdoing \b|\bsome \b|\bhasn \b|\bhasn\'t \b|\bare \b|\bour \b|\bourselves \b|\bout \b|\bwhat \b|\bfor \b|\bneedn\'t \b|\bbelow \b|\bre \b|\bdoes \b|\bshouldn\'t \b|\babove \b|\bbetween \b|\bmustn \b|\bt \b|\bbe \b|\bwe \b|\bwho \b|\bmightn\'t \b|\bdoesn\'t \b|\bwere \b|\bhere \b|\bshouldn \b|\bhers \b|\baren\'t \b|\bby \b|\bon \b|\babout \b|\bcouldn \b|\bof \b|\bwouldn\'t \b|\bagainst \b|\bs \b|\bisn \b|\bor \b|\bown \b|\binto \b|\byourself \b|\bdown \b|\bhadn\'t \b|\bmightn \b|\bcouldn\'t \b|\bwasn \b|\byour \b|\byou\'re \b|\bfrom \b|\bher \b|\btheir \b|\baren \b|\bit\'s \b|\bthere \b|\bbeen \b|\bwhom \b|\btoo \b|\bwouldn \b|\bthemselves \b|\bweren \b|\bwas \b|\buntil \b|\bmore \b|\bhimself \b|\bthat \b|\bdidn\'t \b|\bbut \b|\bthat\'ll \b|\bwith \b|\bthan \b|\bthose \b|\bhe \b|\bme \b|\bmyself \b|\bma \b|\bweren\'t \b|\bthese \b|\bup \b|\bwill \b|\bwhile \b|\bain \b|\bcan \b|\btheirs \b|\bmy \b|\band \b|\bve \b|\bthen \b|\bis \b|\bam \b|\bit \b|\bdoesn \b|\ban \b|\bas \b|\bitself \b|\bat \b|\bhave \b|\bin \b|\bany \b|\bif \b|\bagain \b|\bno \b|\bwhen \b|\bsame \b|\bhow \b|\bother \b|\bwhich \b|\byou \b|\bshan\'t \b|\bshan \b|\bneedn \b|\bhaven \b|\bafter \b|\bmost \b|\bsuch \b|\bwhy \b|\ba \b|\boff \b|\bi \b|\bm \b|\byours \b|\byou\'ll \b|\bso \b|\by \b|\bshe\'s \b|\bthe \b|\bhaving \b|\bonce \b"
    regex_for_not = r"\bnot \b"
    in_str = in_str.lower()
    in_str = re.sub(regex_for_not, "not-", re.sub(regex_for_stopwords, "", in_str))
    tokenizer = RegexpTokenizer('[a-zA-Z0-9-]+')
    tokenized_set = set([token_split for token in tokenizer.tokenize(in_str) for token_split in re.split(r'(\d+)', token) if token_split])
    stemmer = SnowballStemmer("english")
    return set([stemmer.stem(token) for token in tokenized_set])

def to_q_desc(q,descs):
    if len(descs) == 0:
        return q
    else:
        return " ".join(descs + [q])

# can be used for step 2. need to have all terms from query appear.
def valid_pid_set(inverted_index_product):
    product_simscores = defaultdict(float)
    
    all_terms_pid_set = set()
    for i, (term, scorelist) in enumerate(inverted_index_product.items()):
        if i == 0:
            all_terms_pid_set = set([asin for (asin, _) in scorelist])
        else:
            all_terms_pid_set = all_terms_pid_set.intersection(set([asin for (asin, _) in scorelist]))
    
    return all_terms_pid_set

def top_k_pids_step3(valid_pids, inverted_index_review):
    product_simscores = defaultdict(float)
    
    for term, scorelist in inverted_index_review.items():
        for (asin, score) in scorelist:
            if asin in valid_pids:
                product_simscores[asin] += score
    
    product_simscores_keys = list(product_simscores.keys())
    product_simscores_np = np.array([product_simscores[i] for i in product_simscores_keys])
    
    product_simscores_keys_indices_ordered = np.argsort(product_simscores_np)[::-1]
            
    top_k_pid_list = [product_simscores_keys[key_index] for key_index in product_simscores_keys_indices_ordered]
    
    return top_k_pid_list

# q is a search name, descs are list of input descriptors, cats are relevant categories
def get_top_k_pids(inverted_index_product, inverted_index_review):

    top_pids_step2 = valid_pid_set(inverted_index_product)

    if len(inverted_index_review) == 0:
        return list(top_pids_step2)
    current_app.logger.info(len(top_pids_step2))

    pids_to_return = top_k_pids_step3(top_pids_step2, inverted_index_review)

    current_app.logger.info(len(pids_to_return))
    return pids_to_return

# move to other file later for cooccurence helpers
def get_cooccurred_terms(terms_scorelist_dict):

    term_cooc_scores = defaultdict(float)

    identical_terms = set(terms_scorelist_dict.keys())
    
    for term, scorelist in terms_scorelist_dict.items():
        for (term, score) in scorelist:
            if term not in identical_terms:
                term_cooc_scores[term] += score

    term_cooc_scores_keys = list(term_cooc_scores.keys())
    term_cooc_scores_np = np.array([term_cooc_scores[i] for i in term_cooc_scores_keys])
    
    term_cooc_scores_keys_indices_ordered = np.argsort(term_cooc_scores_np)[::-1]
            
    top_k_term_list = [term_cooc_scores_keys[key_index] for key_index in term_cooc_scores_keys_indices_ordered]
    
    current_app.logger.info(top_k_term_list)
    return top_k_term_list
