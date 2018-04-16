from . import *
from app.irsystem.models.helpers import *
from app.irsystem.models.helpers import NumpyEncoder as NumpyEncoder
from app.irsystem.models.product import products_with_pids
from flask import jsonify
from flask import current_app

project_name = "Amazen"
net_id = "Joo Ho Yeo (jy396) | Amritansh Kwatra (ak2244) | Alex Yoo (ay244) | Jay Chia (jc2375) | Charles Bai (cb674)"

###################################################################################################
# Placeholder functions
##################################################################################################
def classify_query(q):
	return "electronics"

def get_top_products(q,descs,cats,k2,k3):
	return top_k_pids(q, descs, cats, k2, k3)

def filter_category_by_query(q, cat):
	return ["1234", "123", "12"]

def rank_pids_with_desc(descs, pid):
	return ["1234", "123", "12"]

def pack_pid_json(pids):
	products = products_with_pids(pids)
	# return [{
	# 	'productTitle': p.name,
	# 	'price': p.price,
	# 	'seller': p.seller_name,
	# 	'desc': p.desc,
	# 	'keywords': ['Hello', 'Goodbye'],
	# 	'keywordscores': [4.0, 2.0],
	# 	'rating': 5.0,
	# 	'numRatings': 578,
	# 	'imgUrl': p.img_url
	# } for p in products]
	return [{
		'productTitle': "HP 8300 Elite Small Form Factor Desktop Computer, Intel Core i5 - 3470 3.2GHz Quad - Core, 8GB RAM, 500GB SATA, Windows 10 Pro 64 - Bit, USB 3.0, Display Port(Certified Refurbished)",
		'price': 418.13,
		'seller': "Charles Bailong",
		'desc': "Deal: Biggest deal ever Make me happy: oh shitNo drawbacks: really sic",
		'keywords': ['Hello', 'Goodbye', 'Steamy', 'Cute', 'Smoking', 'Lol'],
		'keywordscores': [4.0, 2.0, 1.5, 1.0 ,5.0 ,4.3],
		'rating': 5.0,
		'numRatings': 578,
		'imgUrl': "https://media.licdn.com/dms/image/C5603AQEApkGEbFQMJw/profile-displayphoto-shrink_800_800/0?e=1528956000&v=beta&t=kOtxa0-7FomSHErGmHV0i7h78tO3J7I5mpzM6qN1WtE"
	} for _ in range(10)]

##################################################################################################
# Views
##################################################################################################

@irsystem.route('/', methods=['GET'])
def search():
	query = request.args.get('search')
	if not query:
		data = []
		output_message = ''
	else:
		output_message = "Your search: " + query
		data = range(5)
	return render_template('search.html', name=project_name, netid=net_id, output_message=output_message, data=data)

@irsystem.route('search_page', methods=['GET'])
def search_page():
	initial_query = request.args.get('query')
	initial_descriptors = request.args.get('descriptors', [])
	if initial_query is None:
		return render_template('search.html')
	return render_template('search_results.html', query=initial_query, descriptors=initial_descriptors)

@irsystem.route('search', methods=['GET'])
def product_search():
	query = request.args.get('query')
	descriptors = request.args.get('descriptors', '')
	if not query:
		d = {
			'status': 400,
			'error_message': 'empty query provided'
		}
		return jsonify(d)

	category = classify_query(query.strip().lower())
	pids = filter_category_by_query(query, category)
	if not (descriptors is None):
		descriptors = descriptors.split(",")
		descriptors = [x.lower().strip() for x in descriptors]
		sorted_pids = rank_pids_with_desc(descriptors, pids)
	else:
		sorted_pids = pids
	d = pack_pid_json(sorted_pids)
	return jsonify(data=d)
