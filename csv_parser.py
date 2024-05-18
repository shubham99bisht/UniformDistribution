f = open('data.csv', 'r')

lines = f.readlines()

data = {}
admNos = []

for l in lines[1:]:
    admNo,name,std,div,gender,uniform,component,size = l.split(',')
    if admNo not in admNos:
        data[admNo] = { 
            'admNo': admNo, 'name': name, 
            'std': std, 'div': div, 'gender': gender,
            'Uniform': {}, 'Sports': {}
        }
        admNos.append(admNo)
    data[admNo][uniform][component] = size
    
print(len(admNos))
print(data)

