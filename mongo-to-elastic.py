import json
import ssl

from pymongo import MongoClient
from elasticsearch import Elasticsearch
from elasticsearch import helpers


class MongoElastic:
    def __init__(self, args):

        # batch setting
        self.chunk_size = args.get('chunk_size', 500)
        self.limit = args.get('limit', None)

        # setup mongo client
        self.mongodb_client = MongoClient("mongodb://localhost:27017")

        # setup elasticsearch client
        self.es_client = Elasticsearch('https://localhost:9200', basic_auth=("elastic", "azjt*71kG2zv+cVkTTD8"),
                    ca_certs="./http_ca.crt")

    def _doc_to_json(self, doc):
        doc_str = json.dumps(doc, default=str)
        doc_json = json.loads(doc_str)
        return doc_json

    def es_add_index_bulk(self, docs):
        actions = []
        for doc in docs:
            _id = doc["_id"]
            del doc["_id"]
            action = {
                "_index": 'recipe',
                "_id": _id,
                "_source": doc
            }
            actions.append(action)

        response = helpers.bulk(self.es_client, actions)
        return response

    def fetch_docs(self, mongodb_query=None, mongodb_fields=None):
        mongodb_query = dict() if not mongodb_query else mongodb_query
        mongodb_fields = dict() if not mongodb_fields else mongodb_fields

        database = self.mongodb_client["food"]
        collection = database["cleaned_recipe"]

        no_docs = 0
        offset = 0

        # spinner = Spinner('Importing... ')

        while True:
            """
            Iterate to fetch documents in batch.
            Iteration stops once it hits limit or no document left.
            """
            mongo_cursor = collection.find(mongodb_query, mongodb_fields)
            mongo_cursor.skip(offset)
            mongo_cursor.limit(self.chunk_size)
            docs = list(mongo_cursor)
            # break loop if no more documents found
            if not len(docs):
                break
            # convert document to json to avoid SerializationError
            docs = [self._doc_to_json(doc) for doc in docs]
            yield docs
            # check for number of documents limit, stop if exceed
            no_docs += len(docs)
            if self.limit and no_docs >= self.limit:
                break
            # update offset to fetch next chunk/page
            offset += self.chunk_size
            # spinner.next()

        self.mongodb_client.close()

    def start(self, mongodb_query=None, mongodb_fields=None):
        for docs in self.fetch_docs(mongodb_query, mongodb_fields):
            self.es_add_index_bulk(docs)


if __name__ == '__main__':
    config = {
        'chunk_size': 100,
        # Set limit=None to push all documents matched by the query
        'limit': 1000
    }
    obj = MongoElastic(config)
    mongodb_query = {}
    mongodb_fields = {"title": 1, "description": 1}
    obj.start(mongodb_query=mongodb_query, mongodb_fields=mongodb_fields)