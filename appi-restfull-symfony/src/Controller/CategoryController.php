<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\Validation;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints\Email;
use Knp\Component\Pager\PaginatorInterface;
use App\Services\JwtAuth;
use App\Entity\Category;

class CategoryController extends AbstractController
{
    public function resJson($data){

        // Serializar datos con servicio serealizer
        $json = $this->get('serializer')->serialize($data, 'json');
        // Response con httpfoundation
        $response = new response();
        // Asignar contenido a la respuesta.
        $response->setContent($json);
        // Indicar formato de respuesta.
        $response->headers->set('Content-Type', 'application/json');
        // Devolver respuesta
        return $response;
    }

    // Metodo para traer una categoria.
    public function getCategory($id){        
        $category = $this->getDoctrine()->getRepository(Category::class)->findOneBy([
            'id' => $id
        ]);
        if(is_object($category)){
            $data = array(
                'status' => 'success',
                'code' => 200,
                'category' => $category
            );
        }else{
            $data = array(
                'status' => 'error',
                'code' => 400,
                'message' => 'La categoria no existe'
            );
        }        

        return $this->resJson($data);
    }

    // metodo para traer todas las categorias.
    public function getCategories(){

        $categories = $this->getDoctrine()->getRepository(Category::class)->findAll();

        if(!empty($categories) && $categories){
            $data = array(
                'status' => 'success',
                'code' => 200,
                'categories' => $categories
            );
        }else{
            $data = array(
                'status' => 'error',
                'code' => 400,
                'message' => 'No existen categorias'
            );
        }
       
        return $this->resJson($data);
    }

    // Metodo para crear una categoria.
    public function create(Request $request, JwtAuth $jwtAuth){

        $token = $request->headers->get('Authorization', null);
        $checkToken = $jwtAuth->checkToken($token);

        $json = $request->get('json', null);
        $params = json_decode($json);
        $params_array = json_decode($json, true);
        $data = array(
            'status' => 'error',
            'code' => 400,
            'message' => 'Error al crear categria, verifque los datos',
        );
        if($checkToken && !empty($params)){

            $name = (!empty($params->name) ? $params->name : null);
            $category = new Category();
            $category->setName($name);
            $category->setCreatedAt(new \Datetime('now'));
            $category->setUpdateAt(new \Datetime('now')); 

            $em = $this->getDoctrine()->getManager();
            $em->persist($category);
            $em->flush();
            $data = array(
                'status' => 'success',
                'code' => 200,
                'message' => 'Categori creada correctamente',
                'category' => $category
            );
        }

        return $this->resJson($data);
    }

    // Metodo para modificar categoria.
    public function update(Request $request, JwtAuth $jwtAuth, $id){

        $token = $request->headers->get('Authorization', null);
        $checkToken =  $jwtAuth->checkToken($token);

        $json = $request->get('json', null);
        $params = json_decode($json);
        $params_array = json_decode($json, true);

        $data = array(
            'status' => 'error',
            'code' => 400,
            'message' => 'Datos incorrectos'
        );
        if($checkToken && !empty($params)){
            $category = $this->getDoctrine()->getRepository(Category::class)->findOneBy([
                'id' => $id
            ]);

            $em = $this->getDoctrine()->getManager();
            $name = (!empty($params->name)) ? $params->name : null;

            if(is_object($category)){
                $category->setName($name);
                $category->setUpdateAt(new \Datetime('now')); 

                $em->persist($category);
                $em->flush();
                $data = array(
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'Categoria actualizada',
                    'changes' => $category
                );
            }
        }       

        return $this->resJson($data);
    }

    // Metodo para eliminar datos
    public function destroy(Request $request, JwtAuth $jwtAuth, $id){
        $token = $request->headers->get('Authorization', null);
        $checkToken = $jwtAuth->checkToken($token);

        $data = array(
            'status' => 'error',
            'code' => 400,
            'message' => 'No exite la categoria'
        );
        if($checkToken){
            $category = $this->getDoctrine()->getRepository(Category::class)->findOneBy([
                'id' => $id
            ]);
            $em = $this->getDoctrine()->getManager();
            $em->remove($category);
            $em->flush();

            $data = array(
                'status' => 'success',
                'code' => 200,
                'message' => 'Categoria eliminada',
                'category' => $category
            );
        }

        return $this->resJson($data);
    }

    public function index()
    {
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/CategoryController.php',
        ]);
    }
}
