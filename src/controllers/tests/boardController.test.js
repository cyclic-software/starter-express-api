import httpMocks from 'node-mocks-http';
import Board from '../../models/Board';
import { home } from '../boardController';

jest.mock('../../models/Board.js', () => ({
  ...jest.requireActual('../../models/Board.js'),
}));

jest.mock('../../models/User.js', () => ({
  ...jest.requireActual('../../models/User.js'),
}));

describe('home', () => {
  let request, response;
  beforeEach(() => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/',
    });
    response = httpMocks.createResponse();
  });

  it('board 랜더', async () => {
    // * given
    jest.spyOn(Board, 'find').mockReturnValueOnce({ boards: 'boards' });
    // * when
    await home(request, response);

    // * then
    expect(response.statusCode).toBe(200);
  });
});
