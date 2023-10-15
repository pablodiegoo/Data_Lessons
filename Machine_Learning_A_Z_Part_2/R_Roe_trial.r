#simple linear regression
dataset = read.csv ('roedata.csv')
library(caTools)
set.seed(123)
# making a regressor model to predict kills do dataroe.csv  dataset
split = sample.split(dataset$Kills, SplitRatio = 2/3)
training_set = subset(dataset, split == TRUE)
test_set = subset(dataset, split == FALSE)
regressor = lm(formula = Kills ~ .,data = dataset)

summary(regressor)
# Print the coefficients
print(regressor$coefficients)
print(regressor$call[2])
# Predicting the Test set results
y_pred = predict(regressor, newdata = test_set)
y_pred
# Visualising the Kills x Model
library(ggplot2)
ggplot()+
  geom_point(aes(x = training_set$Kills, y = training_set$Kills), color = 'red')+
  geom_line(aes(x = predict(regressor, newdata = training_set), y = predict(regressor, newdata = training_set)), color = 'blue')+
  geom_point(aes(x = test_set$Kills, y = test_set$Kills), color = 'green')+
  ggtitle('Kills vs Model (Training+Test set)')+
  xlab('Model')+
  ylab('Kills')

as.formula(
  paste0("y ~ ", round(coefficients(regressor)[1],2), "", 
         paste(sprintf(" %+.2f*%s ", 
                       coefficients(regressor)[-1],  
                       names(coefficients(regressor)[-1])), 
               collapse="")
  )
)

