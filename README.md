# CAHLeM
CAHLeM (pronounced Kay-Lem) is an open source tool to quickly classify text. 
![alt text](/assets/img/demo.gif "Logo Title Text 1")

## Motivation
CAHLeM sets out to solve the problem of "What to label" when labeling an NLP dataset. It's premise is that the 
people doing the labeling know something about the data, and we should enable them to leverage that knowledge when they label. 

CAHLeM's second premise is the belief that Labeling data is an engineering, DevOps and UX issue, and its implementation and execution should be removed from core data science work. 

### Business Motivation
We ([LightTag](https://lighttag.io)) are a for-profit company and when we embark on an open-source adventure we should be forthcoming with ourselves and our users as to why we are doing this, as a business. 

Our mission is to remove the barrier of labeled data from the NLP process. We think that the problem of finding what to label is an important milestone on the way to achieving the larger mission. In that sense we want a tool like this to further our mission and product. 
Concurrently, we don't think that solving this problem removes the labeled data barrier, that's what LightTag is for. Said more bluntly, we don't see this as canaballising our business and so are comfortable developing it in the open. We hope to make a contribution to the overall NLP community and benefit from the communities contribution in feedback and pull requests. 

## What does it do

CAHLeM is a set of React components that query ElasticSearch. The queries and components are designed to allow a team of labelers to 
1. Input there knowledge into the labeling process via search
2. Find new features and anchors by leveraging "Machine Learning" 

## Project Structure
*client* holds the React client.
*es-docker* has Docker files and configs to run a local demo
