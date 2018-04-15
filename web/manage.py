import os
from flask_script import Manager, Command
from flask_migrate import Migrate, MigrateCommand
from app import app, db
from app.irsystem.models.product import new_products
from collections import namedtuple

# Migrations
migrate = Migrate(app, db)
manager = Manager(app)
manager.add_command("db", MigrateCommand)

# Initial loading of data
ProductTuple = namedtuple("ProductTuple", 'name price img_url azn_product_id seller_name')
@manager.command
def loadproducts(json_location):
  assert(os.path.isfile(json_location))
  print("Here!")


if __name__ == "__main__":
  manager.run()
