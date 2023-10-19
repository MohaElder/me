<!-- 
id: 
published: true
type: comment
title: Why don't I like OAs & how to design a good OA
brief: My thoughts and comments on tech job market these days
cover: https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstore-images.s-microsoft.com%2Fimage%2Fapps.47784.69945075044825416.99d4e5d8-fac1-421b-8986-d0fed49db992.3cffda34-9da3-4a35-a94e-da061aa0ce7f%3Fmode%3Dscale%26q%3D90%26h%3D1080%26w%3D1920&f=1&nofb=1
date: 2023/10/19
-->

# Why don't I like OAs & how to design a good OA

OA is an abbreviation for Online Assessments. It has been broadly used by companies to test out job candidates' coding skills on tech positions. 

Normally, an OA is being done on a website involving one or several coding questions, the candidate sometimes have an online ide within that website to complete it while some might submit the result afterwards. Most OAs are timed, and candidates can choose their preferred programming language to complete the questions. 

OAs are often the second barrier of a hiring process. The process normally includes the following steps:

1. You apply
2. The HR sorts(sometimes randomly selects) your portfolio **Note: sometimes OA are also given this time to expedite the hiring process**
3. Gives you an OA and evaluate your performance on that
4. First vibe check from the HR and also make sure you can meet up with the start time and visa stuff if you work abraod
5. One or more technical interviews from the HR and/or the hiring manager and/or some staff
6. Second vibe check interview from the hiring manager and sometimes including the HR or some higher level people
7. Background check

In a short, OA is believed to be one of the most efficient and scientific way to evaluate if the candidate's programming skills meets the job's requirements.

But as you can see from the title, I am gonna talk about why I don't like OAs and think that it could be an invalid evaluation of one's actual skills.

Before I start "bashing" OA, I would like to make the following claims to make me feel less like some guy who just got fucked by an OA and decided to write this blog.

### Claims

1. I just took an OA and kinda fucked it up before writing this blog
2. I am not good at math and algorithm stuff
3. I am currently looking for a job and OA is kinda fucking me up

With these claims in mind, I would like to advise you that I definitely have bias towards OAs. **But I would assure you that I am writing this blog with arguments and evidence as neutral as possible. To prove that, here's a list of disclaimers**

### Disclaimers

1. Not all OAs are bad, I will explain it later. But most OAs suck.
2. I did manage to pass some OAs, both good ones and bad ones
3. This article is aimed only for engineering jobs, Algorithm and Science job posts are not targetted
4. I am sober right now

Ok, let's start ;)

## I don't like most OAs because they do not accurately represent the JD(Job Description)
If you have ever done OA, you definitely encountered the following situation:

You are applying for a Frontend Engineer Internship from some company you never know but it's on Linkedin job board. The JD says you should have good knowledge of React, JavaScript, and Webpack. It is preferred that if you have knowledge on Python(Pandas, Pydantic, Django), Docker and Postman.

So, you think that the team uses React for frontend and Django for backend. Your main job is to work on React, but sometimes you need to do some QA, DevOps, and Backend with Django. That's pretty cool! You were planning to improve your Docker skill from StackOverflow commands to Kubernates Master anyways. 

As a third year Computer Science student, you learned about Red Black Trees, Huffman Encoding, and etc. Hell, you even learned how to design, prove, and analyze dynamic programming. Aside from school, you taught yourself React and got a personal project built with that. You also did some Full Stack project with React + Django for a school club. You feel qualified for this job, so you applied.

Luckily, this application didn't get a rejection but a "rare" OA invitation. So, you opened up the OA and is ready to do some React. AND THEN, you see some crazy question about reversing nodes in a tree with some requirements that took you 30 minutes to understand. At last, the system automatically submitted your broken in progress code with a bunch of log functions. Congratulation, now you feel as fucked up as me just now :)

This story is a bit long, but the main take over is that: Many OAs out on the job market are **not** accurate representation of what you are expected to do in your job. It is common that companies assign candidates OAs much harder/out of the scope than what they are expected to do. Many of my friends told me that their hardest coding challenge during their job was the OA when they apply for that job.

If you are also familiar with the tech job market, you probably noticed that I did not mention websites like LeetCode or CodeSignal. It is true that people are aware that OAs are often super challenging and they would go to these websites to practice OAs before they got one. It is cool that you practice some OAs on these websites, most of them are actually interesting and can both increase your chance to get hired and also your personal programming skills. **But, if you are overdoing it. I think it is stupid and bad, and it's the companies' fault**.

The main reason that overdoing OA is stupid is because it does not reflect your actually programming skill. When you practive a lot of OAs before doing the actual OA, it is like cramming for an exam. People often hope to practice enough questions so that the actual OA is something they have done before. So, all they did is to write what they had in memory quickly to get a full score in a short time. This is exactly how a over-challenging OA fucks up both the candidate and the company itself. The candidates have little idea of what they were writing, the company did not get a truthful evaluation of the candidates' programming skill. In the end, the companies just hire people who are good at cramming OAs.

This argument also successfully refutes a potential rebuttal: If someone can do an OA harder than what they are expected to work on, they can do the actual job better. When a company hires someone who passed an extremely out of the JD scope OA, it is highly possible that the candidate spend considerate amount of time on their OA skills. In general, if you are not someone super smart, the ability to pass challenging OAs is gained from sacrificing your time practicing on your actual Software Engineering Skills. If you spend most of your time on LeetCode, how could you have time to work on improving your software engineering skills and to do meaningful projects? 

Also, it is trivially known that good at algorithms and math does not mean that you are good at software engineering. These are actually two realms. Many "hacks" to improve the runtime and space of a solution are bad practices in Software Engineering. Most of the hacks has trade-offs that lose the readibility and robustness of the code. For example, if you implement a hash table with Array. The way to expand it when needed is to build an array larger than the previoud Array, and then move all the values in the previous Array into this new Array. A general good solution would be to double the Hash Table size when we need to expand it. This gives us a average-case performance. One common "hack" people do in OA is that instead of doubling the size, they 10 times the size. This seems to cost less runtime since much less times are needed to expand the array. It would perfectly on some OAs as the tests won't cover that much use cases. But, in the reality, when you do this on an actual product. It is almost guaranteed to take huge amounts of space in one day, and the growth would be huge. Just imagine an array that is 10,000 big needs to expand, now we have generated an array 100,000 big. This is a huge waste of storage. This is also why many of the IOI(International Olympiad in Informatics) people are bad in Software Engineering, because they like these hacks. These hacks are eventually products of a prime solution under controlled circumstances(test case, guaranteed conditions, etc), and they are not applicable in real life Software Engineering.

In a total, an OA that does not accurately represent the JD has the following down sides:

1. Candidates who nail these OAs are not guaranteed to be good at their jobs
2. People tend to cram OAs before doing the actual OA, wasting time and energy to actually improve skills that matter
3. This practice has become a phenomenon which creates a bad cycle for point 1 and point 2 to occur infinitely, and it just gets worse

## Ok, so how to design a good OA?

Based on my personal experience with OAs and works, I think a good OA should meet the following criterias:

1. Accurate with what you are expected to work on
2. Evaluated within the Software Engineering scope
3. Designed to be Open Internet friendly

#### Accurate with what you are expected to work on
This is trivial. If you apply for a React position that requires you to make React components, you should be tested on making React components. It should be a bit challenging because since it is about the actual job, the challenge effectively ranks candidates' performances. The following would be a good example to test one's React skills on making React components:

Time: 1 hour

Here's a broken Checkout page made with React. Please identify the breaking behavior and fix it. Once you fixed it, please add the following features

1. Make a component to allow the customers to select different currency units, the default currency unit should be the customer's location(a fake location has been set in your workspace, no browser permission is needed). Once the customer changes the currency unit, all the prices should be converted. Please use `https://some_api.com/api/country` when making the component.

2. Please make the code as clean and robust as possible. We value readibility and extensibility a lot. Comments are also preferred if possible.

3. If you still have time, please make a cache feature such that once the customer chooses a currency unit option, the currency unit will not be set to their default one when they revisit the site.

We will use this example in the next criteria explanation.

#### Evaluated within the Software Engineering scope

When we evaluate an OA, we should not only evaluate based on its runtime and space consumption. In Software Engineering, many of the hard performance rules or ideal OOP practices are being omitted based on many Software Engineering Principle like [SOLID](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design) or [KISS](https://en.wikipedia.org/wiki/KISS_principle).

Some points we should evaluate could be:
1. Readibility
2. Robustness
3. Reasonable Runtime
4. Reasonable Space Consumption
5. Extensiveness

Now, let's try to evaluate the previous example OA on making React components:

We should first run some test cases to see if everything works properly and to see if it's reasonably optimized. Next, we should delve into the code, check for magic variable names, goofy algorithms. It is important to see if the candidate writes any methods where built-in solutions exist. Most cases the built-in solutions are better than what we try to write by ourselves, and we should usually use stuff that are already they instead of trying to write our own ones. It is a waste of time unless you are someone like Rich Harris or You Yu Xi. Finally, we should check if this code can affect other code or can be affected if we modify the other parts of the code. The last thing you would want to see during work is that your changes on a country code in the country api breaks up the currency unit component because it "wisely" stores the api result into `localStorage` and never checks for updates.

#### Designed to be Open Internet friendly

As software engineers, we definitely browse the internet everyday to search for a syntax or some methods. This is not harmful at all to the OA as long as you design the OA to be an open ended mini project. It is true that internet can provide you the best solution to solve the ["reversing nodes in k-group"](https://leetcode.com/problems/reverse-nodes-in-k-group/) question I mentioned earlier in the article. But if you are working on an open-ended project like the example I provided above, the most you can do is to ask ChatGPT how to do it, and we all know that ChatGPT cannot do everything for you unless you have a super good prompt. And here's the dillema: if you can come up with a good enough prompt to have ChatGPT write a solution for that project meeting all criterias mentioned above, you probably have solid understanding on what's needed for the job. If that's the case, you are naturally qualified. So, I would say that we should allow people to use any helps during an OA if they can use that help during work. Search Engines and AI are already part of Software Engineering workflow, and we should include them in OAs to accurately represent the actual job expectations.

### Conclusion

I'm sorry if reading this makes you feel my anger and depression on OAs I did before, but I hope this blog helps you. If you are also looking for jobs, I hope you understand that failing to pass these over-challenging OAs are not your fault and you should not feel bad about it. They don't accurately reflect your software engineering skills and you will eventually find a company who finds you talented. In fact, Among the companies that I have worked with, 1 of them did not give me an OA, and 2 of them have pretty good OAs that has the qualities of what I believe a good OA should have. If you are a recruiter or hiring manager giving our inaccurate OAs, I hope that this blog provides you a logical explantions on why you should not give these OAs out. Good OAs not only helps the candidates, but also the companies. This job market is not fair, and let's try to make it more fair by accurately evaluting candidates for both sides' good.