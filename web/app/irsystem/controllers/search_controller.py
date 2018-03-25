from . import *
from app.irsystem.models.helpers import *
from app.irsystem.models.helpers import NumpyEncoder as NumpyEncoder

project_name = "Amazen"
net_id = "Joo Ho Yeo (jy396) | Amritansh Kwatra (ak2244) | Alex Yoo (ay244) | Jay Chia (jc2375) | Charles Bai (cb674)"

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
