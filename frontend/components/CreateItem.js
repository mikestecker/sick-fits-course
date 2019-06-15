import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: Upload
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: { create: { file: $image } }
      largeImage: $largeImage
    ) {
      id
      image {
        id
      }
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: "",
    description: "",
    image: null,
    largeImage: "",
    price: 0
  };
  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
    console.log(this.state);
  };

  // https://manticarodrigo.com/file-handling-s3-prisma-graphql-yoga/
  uploadFile = async e => {
    let files = e.target.files;
    this.setState({ image: files[0] }, () => {
      console.log(this.state.image);
    });
    console.log(files[0]);
  };

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              // Stop the form from submitting
              e.preventDefault();
              // call the mutation
              const res = await createItem();
              // change them to the single item page
              // console.log(res);
              Router.push(
                {
                  pathname: "/item",
                  query: { id: res.data.createItem.id }
                },
                `/i/${res.data.createItem.id}`
              );
            }}
          >
            <h2>Sell an item.</h2>
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="image">
                Image
                <input
                  type="file"
                  id="image"
                  name="image"
                  placeholder="Upload an image"
                  required
                  accept="image/*"
                  onChange={this.uploadFile}
                />
                {this.state.image && (
                  <img
                    width="200"
                    src={this.state.image}
                    alt="Upload Preview"
                  />
                )}
              </label>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  required
                  value={this.state.title}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="price">
                Price
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  required
                  value={this.state.price}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="description">
                Description
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter a description"
                  required
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;

export { CREATE_ITEM_MUTATION };
