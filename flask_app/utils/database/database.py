import mysql.connector
import glob
import json
import csv
from io import StringIO
import itertools
import hashlib
import os
import cryptography
from cryptography.fernet import Fernet
from math import pow

class database:

    def __init__(self, purge = False):

        # Grab information from the configuration file
        self.database       = 'db'
        self.host           = '127.0.0.1'
        self.user           = 'master'
        self.port           = 3306
        self.password       = 'master'
        self.tables         = ['institutions', 'positions', 'experiences', 'skills',
                               'feedback', 'users', 'words','scoreboard']
        self.loginCounter   = 0
        self.newUserCounter = 0

        # NEW IN HW 3-----------------------------------------------------------------
        self.encryption     =  {   'oneway': {'salt' : b'averysaltysailortookalongwalkoffashortbridge',
                                                 'n' : int(pow(2,5)),
                                                 'r' : 9,
                                                 'p' : 1
                                             },
                                'reversible': { 'key' : '7pK_fnSKIjZKuv_Gwc--sZEMKn2zc8VvD6zS96XcNHE='}
                                }
        #-----------------------------------------------------------------------------
    """
    Calls the query function in python to SQL to get data 
    """
    def query(self, query = "SELECT * FROM users", parameters = None):

        cnx = mysql.connector.connect(host     = self.host,
                                      user     = self.user,
                                      password = self.password,
                                      port     = self.port,
                                      database = self.database,
                                      charset  = 'latin1'
                                     )


        if parameters is not None:
            cur = cnx.cursor(dictionary=True)
            cur.execute(query, parameters)
        else:
            cur = cnx.cursor(dictionary=True)
            cur.execute(query)

        # Fetch one result
        row = cur.fetchall()


        #commit out this line cause I need to for HW 2
        #cnx.commit()

        if "INSERT" in query:
            cur.execute("SELECT LAST_INSERT_ID()")
            row = cur.fetchall()
            cnx.commit()
        cur.close()
        cnx.close()
        return row
    """
    Creates the table for the users 
    """
    def createTables(self, purge=False, data_path = 'flask_app/database/'):

        #should be in order or creation - this matters if you are using forign keys.

        if purge:
            for table in self.tables[::-1]:
                self.query(f"""DROP TABLE IF EXISTS {table}""")

        # Execute all SQL queries in the /database/create_tables directory.
        for table in self.tables:

            #Create each table using the .sql file in /database/create_tables directory.
            with open(data_path + f"create_tables/{table}.sql") as read_file:
                create_statement = read_file.read()
            self.query(create_statement)

            # Import the initial data
            try:
                params = []
                with open(data_path + f"initial_data/{table}.csv") as read_file:
                    scsv = read_file.read()
                for row in csv.reader(StringIO(scsv), delimiter=','):
                    params.append(row)

                # Insert the data
                cols = params[0]; params = params[1:]
                self.insertRows(table = table,  columns = cols, parameters = params)
            except:
                print('no initial data')
    """
    Inert the a Row of data in the data base 
    """
    def insertRows(self, table='table', columns=['x','y'], parameters=[['v11','v12'],['v21','v22']]):
        #
        # # Check if there are multiple rows present in the parameters
        # has_multiple_rows = any(isinstance(el, list) for el in parameters)
        # keys, values      = ','.join(columns), ','.join(['%s' for x in columns])
        #
        # # Construct the query we will execute to insert the row(s)
        # query = f"""INSERT IGNORE INTO {table} ({keys}) VALUES """
        # if has_multiple_rows:
        #     for p in parameters:
        #         query += f"""({values}),"""
        #     query     = query[:-1]
        #     parameters = list(itertools.chain(*parameters))
        # else:
        #     query += f"""({values}) """

        column = ', '.join(columns)
        numb_of_columns = ', '.join(['%s'] * len(columns))

        for values in parameters:
            # Construct the SQL query for inserting rows
            query = f"INSERT INTO {table} ({column}) VALUES ({numb_of_columns});"
            # Execute the query with the current set of values
            self.query(query, values)

        #insert_id = self.query(query,parameters)[0]['LAST_INSERT_ID()']
        return True

#######################################################################################
# Resume RELATED
#######################################################################################

    """
       Goes to all the SQL file that are related to resumes and grabs them then returns it to as nestled discretionary 
       return: A dic with all resume data 
    """
    def getResumeData(self):
        # All the resume data
        resume = dict()

        # Grab the institution data
        institutions = self.query("SELECT * FROM institutions")
        print("int", institutions)
        for institution in institutions:
            int_data = {
                'type': institution['type'],
                'name': institution['name'],
                'department': institution['department'],
                'address': institution['address'],
                'city': institution['city'],
                'state': institution['state'],
                'zip': institution['zip'],
                'positions': dict()
            }
            # Grabs the positions data
            positions = self.query(f"SELECT * FROM positions WHERE inst_id={institution['inst_id']}")
            for position in positions:
                pos_data = {
                    'title': position['title'],
                    'responsibilities': position['responsibilities'],
                    'start_date': position['start_date'],
                    'end_date': position['end_date'],
                    'experiences': dict()
                }
                # Grabs the experiences data
                experiences = self.query(f"SELECT * FROM experiences WHERE position_id={position['position_id']}")
                for experience in experiences:
                    exp_data = {
                        'name': experience['name'],
                        'description': experience['description'],
                        'hyperlink': experience['hyperlink'],
                        'start_date': experience['start_date'],
                        'end_date': experience['end_date'],
                        'skills': dict()
                    }
                    # Grabs the skills data
                    skills = self.query(f"SELECT * FROM skills WHERE experience_id={experience['experience_id']}")
                    for skill in skills:
                        skill_data = {
                            'name': skill['name'],
                            'skill_level': skill['skill_level']
                        }

                        # Link all the dic together
                        exp_data['skills'][skill['name']] = skill_data
                    pos_data['experiences'][experience['name']] = exp_data
                int_data['positions'][position['title']] = pos_data
            resume[institution['name']] = int_data
        return resume
#######################################################################################
# AUTHENTICATION RELATED
#######################################################################################
    """
    Creates a new user and input it into the database if they don't already exist's
    @:param email - the user email 
    @:param password- the user password
    @:param role - is the user a guest or owner  
    """
    def createUser(self, email='me@email.com', password='password', role='user'):

        #user = self.authenticate(email, password)
        users = self.query(f"SELECT * FROM users WHERE email = '{email}'")
        otherUser = self.query(f"SELECT * FROM users")
        # print("email", email)
        # print("users", users)
        # print("other Users", otherUser)

        if users:
            print("user already exists ")
            return {'success': 0}
        else:
            userPassword = self.onewayEncrypt(password)
            self.insertRows(table='users',
                            columns=["email", "password", "role"],
                            parameters=[(email, userPassword, role)])
            return {'success': 1}

    """
        Check to make sure the username and password match up for a user 
        @:param email - the user email 
        @:param password- the user password
    """
    def authenticate(self, email='me@email.com', password='password'):
        # Retrieve all registered users.
        query = """SELECT * FROM users;"""
        results = self.query(query)
        # users = self.query(f"SELECT * FROM users WHERE email = '{email}'")

        print("results in authenticate ", results)
        # Check each user's email and password for a match.
        for row in results:
            if row['email'] == email and row['password'] == self.onewayEncrypt(password):
                    self.loginCounter = 0
                    return {'success': 1}  # Response indicating successful authentication.

        # If no match is found, increment login attempts and return failure.
        self.loginCounter += 1
        return {'success': 0}  # Response indicating unsuccessful authentication.

    """
    Make a one way encryption of a string sent in
    @:param string - the string the should be encrypted 
    """
    def onewayEncrypt(self, string):
        encrypted_string = hashlib.scrypt(string.encode('utf-8'),
                                          salt = self.encryption['oneway']['salt'],
                                          n    = self.encryption['oneway']['n'],
                                           r    = self.encryption['oneway']['r'],
                                          p    = self.encryption['oneway']['p']
                                          ).hex()
        return encrypted_string

    """
    Make a encryption that is reversible 
    @:param - should this be encrypt or decrypt
    @:param - the message that should changed 
    """
    def reversibleEncrypt(self, type, message):
        fernet = Fernet(self.encryption['reversible']['key'])
        if type == 'encrypt':
            message = fernet.encrypt(message.encode())
        elif type == 'decrypt':
            message = fernet.decrypt(message).decode()

        return message

#######################################################################################
# WORDLE RELATED
#######################################################################################

    """
    Get the word the day from the data base 
    @:parm the score you want the day 
    """
    def getWordofTheDay(self,date):
        query = f"""SELECT * FROM words WHERE date = '{date}' ORDER BY word_id DESC LIMIT 1"""
        word = self.query(query)
        print("getWordofTheDay", word)
        return word[0]['word']
    """
    Get the the score according to the day 
    @:parm the score you want the day  
    """
    def getScoreboard(self,date):
        query = f"""SELECT * FROM scoreboard WHERE date = '{date}'"""
        print("getScoreboard", self.query(query))
        return self.query(query)