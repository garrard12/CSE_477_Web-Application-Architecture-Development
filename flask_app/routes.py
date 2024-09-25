# Author:
from flask import current_app as app
from flask import render_template, redirect, request, session, url_for, copy_current_request_context,jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room, rooms, disconnect
from .utils.database.database  import database
from werkzeug.datastructures   import ImmutableMultiDict
from pprint import pprint
import json
import random
import functools
from . import socketio
import subprocess
import sys
import datetime

import http.client

try:
    from bs4 import BeautifulSoup

except:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "bs4"])
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests"])
    from bs4 import BeautifulSoup

db = database()



#######################################################################################
# AUTHENTICATION RELATED
#######################################################################################
def login_required(func):
    @functools.wraps(func)
    def secure_function(*args, **kwargs):
        if "email" not in session:
            return redirect(url_for("login", next=request.url))
        return func(*args, **kwargs)
    return secure_function

"""
Get the username a decrypt the information 
"""
def getUser():
	return db.reversibleEncrypt('decrypt',session['email']) if 'email' in session else 'Unknown'
"""
Renders the login page 
"""
@app.route('/login')
def login():
    return render_template('login.html', user=getUser(), loginConunter=db.loginCounter)

"""
When logout is clicked send it them back to ghome page 
"""
@app.route('/logout')
def logout():
    session.pop('email', default=None)
    return redirect('/')
"""
Makes sure the use exist in the data base 
"""
@app.route('/processlogin', methods = ["POST","GET"])
def processlogin():
    # getting the information for use
    form_fields = dict((key, request.form.getlist(key)[0]) for key in list(request.form.keys()))
    # print("processLogin() reauest form ", request.form)
    # print("processLogin():  form_field", form_fields)

    # encryped the email of the user the session is good
    inDataBase = db.authenticate(form_fields['email'], form_fields['password'])
    # print("processLoging(): inDatabase", inDataBase)

    if inDataBase['success'] != 0:
        session['email'] = db.reversibleEncrypt('encrypt', form_fields['email'])
        # print("processLoging(): success before jsondump")
        db.loginCounter = 0
        return json.dumps({'success': 1})

    return json.dumps({'success': 0})


#######################################################################################
# New User related
#######################################################################################

"""
Renders the signUp pages  
"""
@app.route('/newuser')
def newuser():
    return render_template('userSignUp.html', user=getUser(), userAlreayExist=db.newUserCounter)

"""
Add the new user to the data base of users 
"""
@app.route('/processnewuser', methods=["POST", "GET"])
def processnewuser():
    # getting the information for use
    form_fields = dict((key, request.form.getlist(key)[0]) for key in list(request.form.keys()))

    userExists = db.createUser(form_fields['email'], form_fields['password'])
    if userExists['success'] != 0:
        session['email'] = db.reversibleEncrypt('encrypt', form_fields['email'])
        db.newUserCounter = 0
        return json.dumps({'success': 1})
    db.newUserCounter += 1
    return json.dumps({'success': 0})


#######################################################################################
# WORDLE RELATED
#######################################################################################
"""
Render the wordle template page
"""
@app.route('/wordle', methods=["POST", "GET"])
@login_required
def wordle():
    getword()
    print("wordle template render")
    return render_template('wordle.html', user=getUser())
""""
Gets the word of the day from Merriam webster 
"""
@app.route('/getword', methods=["POST"])
def getword():
    # scrape the word
    url = 'www.merriam-webster.com'
    conn = http.client.HTTPSConnection(url)
    path = '/word-of-the-day'
    conn.request('GET', path)
    response = conn.getresponse()
    htmlFile = response.read().decode('utf-8')
    conn.close()

    soup = BeautifulSoup(htmlFile, 'html.parser')
    serectWord = soup.find_all('h2', class_="word-header-txt")[0].string
    #store the word into the data bade
    db.insertRows(table='words',
                  columns=['word_id', 'word', 'date'],
                  parameters=[(0, serectWord, datetime.date.today())])
    # STill need to store it in the database
    print("serectWord", serectWord, len(serectWord))
    return jsonify({'wordLength': len(serectWord)})

""""
Calls words API to see if the word is a real word 
"""
@app.route('/realWord', methods=["POST"])
def realWord():
    data = request.json

    url = "https://wordsapiv1.p.rapidapi.com/words/" + data.get('guess', '')
    headers = {
        "X-RapidAPI-Key": "8e074afa50msh26df25f0aa07dd5p14cf94jsn6b1d4c96e067",
	    "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
    }

    url = 'wordsapiv1.p.rapidapi.com'
    conn = http.client.HTTPSConnection(url)
    path = f"/words/{data.get('guess', '')}"
    conn.request('GET', path,headers=headers)

    response = conn.getresponse()
    htmlFile = response.read().decode('utf-8')
    conn.close()


    isWord = False
    if not ("word not found" in htmlFile):
        isWord = True
    print(f"isWord {isWord}")
    result = {'status': 'success', "isWord": isWord}
    return result

"""
Checks the user guess and changes change the color of the words according to Wordle Rules 
"""
@app.route('/checkWord', methods=["POST"])
def checkWord():
    data = request.json
    user_guess = data.get('guess', '')
    print("user_guess", user_guess)
    print(db.getWordofTheDay(datetime.date.today()))
    wordOfTheDay = db.getWordofTheDay(datetime.date.today()).upper()

    corretWord = False
    if wordOfTheDay == user_guess:
        corretWord = True

    newGridColor = []
    for x in range(len(wordOfTheDay)):
        print(wordOfTheDay[x])
        if wordOfTheDay[x] == user_guess[x]:
            newGridColor.append('#578C55')# Green
        elif user_guess[x] in wordOfTheDay:
            newGridColor.append('#B1A04C')# yellow
        else:
            print("checkWordx", user_guess[x])
            newGridColor.append('#3A3A3C')# Grey
        user_guess = user_guess.replace(user_guess[x], '#', 1)
        print(f"word after replacement {user_guess}")

    print(f"newGridColor {newGridColor}")

    result = {'status': 'success', 'newGridColor': newGridColor, 'correctWord': corretWord}
    return jsonify(result)
"""
Updates the score board then get send back the top 5 score of the day 
"""
@app.route('/Scoreboard',methods=["POST"])
def scoreboard():
    data = request.json
    date = datetime.date.today()

    if data.get('addToScore', ''):
        db.insertRows(table='scoreboard',
                  columns=['score_id', 'user_name', 'score', 'date'],
                  parameters = [(0, getUser(), int(data.get('score', '')), date)])

    leaderBoard = db.getScoreboard(date)
    topFiveScores = sorted(leaderBoard, key=lambda x: x['score'])[:5]

    print(f"topFive {topFiveScores}: scroreBoard {leaderBoard},date {date}")

    result = {'status': 'success', "TopFiveScores": topFiveScores, "HiddenWord": db.getWordofTheDay(datetime.date.today())}
    return jsonify(result)

#######################################################################################
# CHATROOM RELATED
#######################################################################################

"""
Render in the chat screen 
"""
@app.route('/chat')
@login_required
def chat():

    return render_template('chat.html', user=getUser())
"""
Send the message which user has enter the chat
"""
@socketio.on('joined', namespace='/chat')
def joined(message):
    join_room('main')
    if getUser() == "owner@email.com":
        emit('status',
             {'msg': getUser() + ' has entered the room.', 'style': 'width: 100%;color:blue;text-align: right'},
             room='main')
    else:
        emit('status',
             {'msg': getUser() + ' has entered the room.', 'style': 'width: 100%;color:grey;text-align: left'},
             room='main')
"""
    Display the message that is put onto the screen 
"""
@socketio.on('msgsend', namespace='/chat')
def msgsend(message):
    join_room('main')
    if getUser() == "owner@email.com":
        emit('status', {'msg': message, 'style': 'width: 100%;color:blue;text-align: right'}, room='main')
    else:
        emit('status', {'msg': message, 'style': 'width: 100%;color:gray;text-align: left'}, room='main')

"""
Send the message that the user has left the chat 
"""
@socketio.on('leave', namespace='/chat')
def leave(message):
    join_room('main')
    if getUser() == "owner@email.com":
        emit('status', {'msg': getUser() + ' has left the room.', 'style': 'width: 100%;color:blue;text-align: right'}, room='main')
    else:
        emit('status', {'msg': getUser() + ' has left the room.', 'style': 'width: 100%;color:gray;text-align: left'}, room='main')

#######################################################################################
# OTHER
#######################################################################################
"""

"""
@app.route('/')
def root():
	return redirect('/home')

@app.route('/home')
def home():
	print('home(): users', db.query('SELECT * FROM users'))
	x = random.choice(['I haven\'t bought a chocolate bar in 3 years', 'I have been climbing since I was 5'
                          , 'I have a concut collection '])
	return render_template('home.html', user=getUser(), fun_fact = x)


@app.route('/resume')
def resume():
    resume_data = db.getResumeData()
    pprint(resume_data)
    return render_template('resume.html', user=getUser(), resume_data=resume_data)


@app.route('/project')
def project():
    return render_template('project.html', user=getUser())


@app.route('/piano')
def linken():
    return render_template('piano.html', user=getUser())


# method, and enctype attributes that specify a POST request.
@app.route('/processfeedback', methods=['POST'])
def processfeedback():
	feedbacks = request.form.to_dict()
	db.insertRows(table="feedback", columns=list(feedbacks.keys()), parameters=[list(feedbacks.values())])
	feedback_query = db.query("SELECT * FROM feedback")
	return render_template('feedback.html', feedback_query=feedback_query)


@app.route("/static/<path:path>")
def static_dir(path):
    return send_from_directory("static", path)

@app.after_request
def add_header(r):
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    return r
