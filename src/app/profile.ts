export const profile = {
 "type": "AdaptiveCard",
 "body": [
  {
   "type": "ColumnSet",
   "columns": [
    {
     "type": "Column",
     "items": [
      {
       "type": "Image",
       "style": "Person",
       "url": "https://s3.amazonaws.com/TWFiles/1/userAvatar/userlogo1493205475166293600.jpg",
       "size": "Small"
      }
     ],
     "width": "auto"
    },
    {
     "type": "Column",
     "items": [
      {
       "type": "TextBlock",
       "weight": "Bolder",
       "text": "Tim Cadenbach",
       "wrap": true
      },
      {
       "type": "TextBlock",
       "spacing": "None",
       "text": "Head of  Integrations",
       "isSubtle": true,
       "wrap": true
      }
     ],
     "width": "stretch"
    }
   ]
  }
 ],
 "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
 "version": "1.0"
}