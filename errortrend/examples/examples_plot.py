import plot
x=[0,1,2,3,4,5]
y=['10921', '9324', '0', '0', '11149', '8835']

y=[int(number) for number in (y)]
image=get_image(x,y)
save_image(image,"test","hi")
